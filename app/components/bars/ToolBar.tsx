import * as React from "react";
import { type Tool, type Common } from "types";
import { Toolbar } from "@base-ui-components/react/toolbar";
import { Match } from "effect";

export function ToolBar({
  commonEn,
  handleToolTrigger,
  back_ref,
  next_ref,
}: {
  commonEn: Common;
  handleToolTrigger: (
    name: Tool["name"],
  ) => React.MouseEventHandler<HTMLButtonElement>;
  back_ref: React.Ref<HTMLButtonElement | null>;
  next_ref: React.Ref<HTMLButtonElement | null>;
}): React.ReactElement {
  const getButtonRef = (name: Tool["name"]) => {
    return Match.value(name).pipe(
      Match.withReturnType<React.Ref<HTMLButtonElement | null> | undefined>(),
      Match.when("back", () => back_ref),
      Match.when("next", () => next_ref),
      Match.orElse(() => undefined),
    );
  };

  return (
    <nav
      id="tool-bar"
      className="sticky top-3 z-50 flex h-12 w-full max-w-[860px] shrink-0 items-start justify-start sm:top-6"
    >
      <Toolbar.Root className="flex items-center gap-2 rounded-lg bg-paper-bg-light p-1.5 shadow-paper sm:gap-4 sm:px-3 sm:py-2">
        <Toolbar.Group className="flex items-center gap-1 p-0 sm:gap-4">
          {commonEn.tool.map(({ name, Icon }: Tool, index: number) => (
            <Toolbar.Button
              key={index}
              ref={getButtonRef(name)}
              onClick={handleToolTrigger(name)}
              className="flex size-10 items-center justify-center rounded-sm bg-paper-bg-light p-0 hover:bg-paper-bg sm:h-auto sm:w-auto sm:px-2 sm:py-1"
            >
              <Icon className="size-5 text-char-default hover:text-paper-blue sm:size-4" />
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
      </Toolbar.Root>
    </nav>
  );
}
