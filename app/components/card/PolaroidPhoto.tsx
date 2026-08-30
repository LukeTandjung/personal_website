import * as React from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { type Photo } from "types";

type PopupStyle = React.CSSProperties & {
  ["--popup-translate"]?: string;
  ["--popup-from-translate"]?: string;
  ["--popup-from-scale"]?: string;
  ["--popup-from-rotate"]?: string;
};

// A polaroid-style photo pinned around the paper sheet. It is the trigger of a
// BaseUI Dialog: clicking it opens the zoomed photo as a modal popup that
// flies out from the polaroid's pinned spot (and back on dismiss) via the
// .paper-popup starting/ending styles.
export function PolaroidPhoto({
  photo,
  open,
  onOpenChange,
}: {
  photo: Photo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const figure = React.useRef<HTMLElement>(null);
  // Measured when the dialog opens; kept after close so the exit animation
  // still knows where to fly back to.
  const [zoom, setZoom] = React.useState<{
    width: number;
    dx: number;
    dy: number;
  } | null>(null);
  // True while the popup is flying back; keeps the pinned figure hidden until
  // the exit animation completes so the two never show at once.
  const [closing, setClosing] = React.useState<boolean>(false);

  const handleOpenChange = (next: boolean): void => {
    if (next && figure.current !== null) {
      const rect = figure.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 640;
      const viewportGutter = mobile ? 32 : 120;
      setZoom({
        width: Math.min(
          photo.width * 3.2,
          Math.max(1, vw - viewportGutter),
          Math.max(1, (vh - viewportGutter) * 0.8),
        ),
        dx: rect.left + rect.width / 2 - vw * 0.5,
        dy: rect.top + rect.height / 2 - vh * (mobile ? 0.5 : 0.46),
      });
    } else {
      setClosing(true);
    }
    onOpenChange(next);
  };

  // Pure-px translates (the popup is width × 5/4 tall): mixing % and px in
  // `translate` is not reliably interpolable across browsers.
  const popupStyle: PopupStyle =
    zoom !== null
      ? {
          width: `${zoom.width}px`,
          "--popup-translate": `${-zoom.width / 2}px ${(-zoom.width * 1.25) / 2}px`,
          "--popup-from-translate": `${-zoom.width / 2 + zoom.dx}px ${(-zoom.width * 1.25) / 2 + zoom.dy}px`,
          "--popup-from-scale": `${photo.width / zoom.width}`,
          "--popup-from-rotate": `${photo.rotate}deg`,
        }
      : {};

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(next) => {
        if (!next) setClosing(false);
      }}
    >
      <Dialog.Trigger
        nativeButton={false}
        render={
          <figure
            ref={figure}
            aria-label={`Photo: ${photo.caption}`}
            className={`pointer-events-auto m-0 cursor-zoom-in ${open || closing ? "invisible" : ""}`}
            style={{
              position: photo.inline === true ? "relative" : "absolute",
              top: photo.inline === true ? undefined : photo.position?.top,
              left: photo.inline === true ? undefined : photo.position?.left,
              right: photo.inline === true ? undefined : photo.position?.right,
              width: `${photo.width}px`,
              maxWidth:
                photo.inline === true ? "calc(100vw - 4rem)" : undefined,
              alignSelf: photo.inline === true ? "flex-end" : undefined,
              transform: `rotate(${photo.rotate}deg)`,
            }}
          />
        }
      >
        <div
          className="aspect-[4/5] w-full rounded-xs bg-paper-grey-l1 bg-cover bg-center shadow-lift"
          style={{ backgroundImage: `url(${photo.src})` }}
        />
        <figcaption className="pointer-events-none absolute right-0 bottom-[3%] left-0 text-center font-hand text-[15px] text-char-muted">
          {photo.caption}
        </figcaption>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] cursor-zoom-out" />
        <Dialog.Popup
          className="paper-popup fixed top-1/2 left-1/2 z-[70] cursor-zoom-out outline-none sm:top-[46%]"
          style={popupStyle}
          onClick={() => onOpenChange(false)}
        >
          <Dialog.Title className="sr-only">{photo.caption}</Dialog.Title>
          <div
            className="aspect-[4/5] w-full rounded-xs bg-paper-grey-l1 bg-cover bg-center shadow-lift"
            style={{ backgroundImage: `url(${photo.src})` }}
          />
          <figcaption className="pointer-events-none absolute right-0 bottom-[3%] left-0 text-center font-hand text-xl text-char-muted">
            {photo.caption}
          </figcaption>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
