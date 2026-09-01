import * as React from "react";
import { Match } from "effect";
import { Dialog } from "@base-ui-components/react/dialog";
import { type Project, type Tone } from "types";

interface DragState {
  index: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  moved: boolean;
}

const statusTone = (status: Project["status"]): Tone =>
  Match.value(status).pipe(
    Match.when("live", (): Tone => "success"),
    Match.when("in progress", (): Tone => "warning"),
    Match.when("discontinued", (): Tone => "danger"),
    Match.exhaustive,
  );

// The face of one index card, shared between the fanned deck and the drawn
// (dialog) view.
function CardFace({
  card,
  index,
}: {
  card: Project;
  index: number;
}): React.ReactElement {
  return (
    <>
      {/* Ruled index-card lines */}
      <div
        className="pointer-events-none absolute top-9 right-0 bottom-0 left-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom,transparent,transparent 21px,rgba(74,111,158,0.28) 21px,rgba(74,111,158,0.28) 22px)",
        }}
      />
      <div className="relative box-border flex h-full flex-col">
        <div
          className="flex items-baseline justify-between px-4 pt-2 pb-[5px]"
          style={{ borderBottom: "1.5px solid rgba(190,74,60,0.55)" }}
        >
          <span className="text-[10px] tracking-[0.14em] text-char-muted">
            PROJECT
          </span>
          <span className="font-display text-base text-char-faint">
            {`no.${index + 1}`}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-[7px] px-4 pt-3 pb-2.5">
          <div className="flex items-center gap-3">
            {card.image_url != null ? (
              <div
                className="size-11 shrink-0 rounded-lg bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${card.image_url})` }}
              />
            ) : null}
            <span className="font-display text-[28px] leading-none font-bold">
              {card.name}
            </span>
            <span
              className={`tone-${statusTone(card.status)} ml-auto shrink-0 rounded-hand-sm border border-tone bg-tone-surface px-2 py-0.5 text-[10px] whitespace-nowrap text-tone`}
            >
              {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
            </span>
          </div>
          <div className="text-xs leading-relaxed text-char-default">
            {card.description}
          </div>
          {card.project_url != null ? (
            <div className="mt-auto font-display text-base text-char-muted">
              <a
                href={card.project_url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line-default underline-offset-4 hover:text-char-default"
                // Keep the deck's drag/return handlers from swallowing the click.
                onPointerDown={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                link
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

const cardTint = (index: number): string =>
  ["bg-tint-blue", "bg-tint-red", "bg-tint-yellow", "bg-tint-green"][index % 4];

const CARD_FRAME =
  "texture-grain box-border h-[210px] w-[320px] touch-none overflow-hidden rounded-hand-sm border border-line-default font-mono text-char-default select-none";

// A fanned deck of index cards pinned to the bottom-right corner of the
// viewport, one card per project. Dragging (or clicking/pressing Enter on) a
// card draws it into a BaseUI Dialog centred on screen; flicking it away,
// clicking it, the backdrop, or pressing Escape returns it to the bottom of
// the deck.
export function ProjectDeck({
  projects,
}: {
  projects: Array<Project>;
}): React.ReactElement {
  const [order, setOrder] = React.useState<Array<number>>(
    projects.map((_, index) => index),
  );
  const [drawn, setDrawn] = React.useState<number | null>(null);
  // The card the dialog popup shows: follows `drawn` but sticks around after
  // close so the popup keeps its face during the exit animation.
  const [shown, setShown] = React.useState<number>(0);
  // Card flying back into the deck after a dismiss. The popup hides instantly
  // (see .paper-popup-instant-exit) and the deck copy animates the fly-back
  // itself, so it can pass *under* its sibling cards — the portaled popup
  // paints above the app root's stacking context and never could.
  const [returning, setReturning] = React.useState<{
    index: number;
    dx: number;
    dy: number;
  } | null>(null);
  // "start": the copy sits at the popup's centre pose; "fly": transitioning home.
  const [returnPhase, setReturnPhase] = React.useState<"start" | "fly">("start");
  // Fan angle the card had when it was drawn; the popup enters from that pose.
  const [entryRotate, setEntryRotate] = React.useState<number>(-8);
  const [drag, setDrag] = React.useState<DragState | null>(null);
  // Re-render on resize so the drawn card recomputes its centring transform.
  const [, setViewport] = React.useState<number>(0);
  // Mirrors of drag/drawn for the window-level pointer handlers, so their
  // decisions never run inside a state updater (updaters must stay pure).
  const dragRef = React.useRef<DragState | null>(null);
  dragRef.current = drag;
  const drawnRef = React.useRef<number | null>(null);
  drawnRef.current = drawn;
  const orderRef = React.useRef<Array<number>>(order);
  orderRef.current = order;

  // Drawing a card immediately sends it to the bottom of the stack (it is
  // hidden while its popup is out), so on return it reappears already in its
  // final spot — reordering at dismiss time would flash the old position.
  const drawCard = React.useCallback((index: number): void => {
    const previous = orderRef.current;
    const depth = previous.length - 1 - previous.indexOf(index);
    setEntryRotate(-8 - depth * 16);
    setOrder([index, ...previous.filter((i) => i !== index)]);
    setDrawn(index);
    setShown(index);
  }, []);

  const returnCard = React.useCallback((): void => {
    const active = drawnRef.current;
    if (active === null) return;
    const currentDrag = dragRef.current;
    const held = currentDrag !== null && currentDrag.index === active;
    setReturning({
      index: active,
      dx: held ? currentDrag.dx : 0,
      dy: held ? currentDrag.dy : 0,
    });
    setReturnPhase("start");
    setDrawn(null);
    setDrag(null);
  }, []);

  // One painted frame at the centre pose, then transition home; the timer
  // clears `returning` once the fly-back has landed.
  React.useEffect(() => {
    if (returning === null) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setReturnPhase("fly"));
    });
    const timer = setTimeout(() => setReturning(null), 420);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [returning]);

  React.useEffect(() => {
    const handleMove = (event: PointerEvent): void => {
      setDrag((current) => {
        if (current === null) return null;
        const dx = event.clientX - current.startX;
        const dy = event.clientY - current.startY;
        return { ...current, dx, dy, moved: current.moved || Math.hypot(dx, dy) > 6 };
      });
    };
    const handleUp = (): void => {
      const current = dragRef.current;
      if (current === null) return;
      const active = drawnRef.current;
      if (active === current.index) {
        // Drawn card: a plain click or a flick towards the corner returns it.
        if (!current.moved || (current.dx > 90 && current.dy > 50)) {
          returnCard();
          return;
        }
        setDrag(null);
        return;
      }
      // Deck card: a plain click or a long enough drag draws it.
      if (!current.moved || Math.hypot(current.dx, current.dy) > 140) {
        drawCard(current.index);
      }
      setDrag(null);
    };
    const handleResize = (): void => setViewport((count) => count + 1);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawCard, returnCard]);

  const deckCardStyle = (index: number): React.CSSProperties => {
    const position = order.indexOf(index);
    const depth = order.length - 1 - position;
    const activeDrag = drag !== null && drag.index === index ? drag : null;
    // First frame of the fly-back: hold the copy at the popup's centre pose
    // (including any drag offset it was dismissed with).
    if (
      returning !== null &&
      returning.index === index &&
      returnPhase === "start" &&
      typeof window !== "undefined"
    ) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const narrow = vw < 640;
      const compact = vw < 1024;
      const scale = Math.min(
        2.2,
        (vw - (narrow ? 32 : 120)) / 320,
        (vh - (narrow ? 64 : 140)) / 210,
      );
      const restY = compact ? 0.5 : 0.46;
      const deckX = compact ? vw - 48 : vw - 88;
      const deckY = compact ? vh - 18 : vh - 17;
      return {
        transition: "none",
        zIndex: 40 + position,
        transform: `translate(${vw * 0.5 - deckX + returning.dx}px,${vh * restY - deckY + returning.dy}px) rotate(-1.5deg) scale(${scale})`,
      };
    }
    return {
      transition:
        activeDrag !== null
          ? "none"
          : "transform 0.38s cubic-bezier(0.22,1,0.36,1)",
      zIndex: 40 + position,
      transform: `translate(${activeDrag !== null ? activeDrag.dx : 0}px,${activeDrag !== null ? activeDrag.dy : 0}px) rotate(${-8 - depth * 16}deg) scale(var(--project-deck-scale, 1))`,
    };
  };

  type PopupStyle = React.CSSProperties & {
    ["--popup-translate"]?: string;
    ["--popup-scale"]?: string;
    ["--popup-rotate"]?: string;
    ["--popup-from-translate"]?: string;
    ["--popup-from-scale"]?: string;
    ["--popup-from-rotate"]?: string;
  };

  // Popup rest position (centre + drag offset) and its entry/exit position
  // (the deck's corner), fed to the shared .paper-popup transition styles.
  // Translates are pure px — mixing % and px in `translate` is not reliably
  // interpolable across browsers, which breaks the fly-back transition.
  const drawnCardStyle = (): PopupStyle => {
    if (typeof window === "undefined") return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const activeDrag = drag !== null && drag.index === drawn ? drag : null;
    const dx = activeDrag !== null ? activeDrag.dx : 0;
    const dy = activeDrag !== null ? activeDrag.dy : 0;
    const narrow = vw < 640;
    const compact = vw < 1024;
    const scale = Math.min(
      2.2,
      (vw - (narrow ? 32 : 120)) / 320,
      (vh - (narrow ? 64 : 140)) / 210,
    );
    const restY = compact ? 0.5 : 0.46;
    const deckX = compact ? vw - 48 : vw - 88;
    const deckY = compact ? vh - 18 : vh - 17;
    return {
      transition: activeDrag !== null ? "none" : undefined,
      cursor: activeDrag !== null ? "grabbing" : "grab",
      "--popup-translate": `${-160 + dx}px ${-105 + dy}px`,
      "--popup-scale": `${scale}`,
      "--popup-rotate": "-1.5deg",
      "--popup-from-translate": `${deckX - vw * 0.5 - 160}px ${deckY - vh * restY - 105}px`,
      "--popup-from-scale": compact ? "0.65" : "1",
      "--popup-from-rotate": `${entryRotate}deg`,
    };
  };

  return (
    <div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[54px] bottom-[200px] z-[41] hidden -rotate-6 font-hand text-xl text-char-muted transition-opacity duration-300 lg:block"
        style={{ opacity: drawn === null ? 1 : 0 }}
      >
        draw a card ↘
      </div>
      {projects.map((card: Project, index: number) => (
        <div
          key={card.name}
          role="button"
          tabIndex={0}
          aria-label={`Project card: ${card.name}`}
          aria-expanded={drawn === index}
          onPointerDown={(event) => {
            event.preventDefault();
            if (drawn !== null) return;
            setDrag({
              index,
              startX: event.clientX,
              startY: event.clientY,
              dx: 0,
              dy: 0,
              moved: false,
            });
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && drawn === null) {
              event.preventDefault();
              drawCard(index);
            }
          }}
          className={`${cardTint(index)} ${CARD_FRAME} project-deck-card fixed right-[-110px] bottom-[-105px] cursor-pointer shadow-paper lg:right-[-72px] lg:bottom-[-88px] ${
            drawn === index ? "invisible" : ""
          }`}
          style={deckCardStyle(index)}
        >
          <CardFace card={card} index={index} />
        </div>
      ))}
      <Dialog.Root
        open={drawn !== null}
        onOpenChange={(open) => {
          if (!open) returnCard();
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] cursor-pointer" />
          <Dialog.Popup
            onPointerDown={(event) => {
              event.preventDefault();
              if (drawn === null) return;
              setDrag({
                index: drawn,
                startX: event.clientX,
                startY: event.clientY,
                dx: 0,
                dy: 0,
                moved: false,
              });
            }}
            className={`${cardTint(shown)} ${CARD_FRAME} paper-popup paper-popup-instant-exit fixed top-1/2 left-1/2 z-[70] shadow-[0_30px_70px_rgba(26,26,26,0.35)] outline-none lg:top-[46%]`}
            style={drawnCardStyle()}
          >
            <Dialog.Title className="sr-only">
              {`Project: ${projects[shown].name}`}
            </Dialog.Title>
            <CardFace card={projects[shown]} index={shown} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
