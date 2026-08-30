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
      className="sticky top-6 z-50 flex items-start shrink-0 justify-start h-12 w-full sm:max-w-3/4 lg:max-w-5/8 lg:flex-row"
    >
      <Toolbar.Root className="flex px-3 py-2 items-center gap-4 rounded-lg bg-paper-bg-light">
        <Toolbar.Group className="flex p-0 items-center gap-4">
          {commonEn.tool.map(({ name, Icon }: Tool, index: number) => (
            <Toolbar.Button
              key={index}
              ref={getButtonRef(name)}
              onClick={handleToolTrigger(name)}
              className="flex px-2 py-1 items-start gap-0 rounded-sm bg-paper-bg-light hover:bg-paper-bg"
            >
              <Icon className="size-4 text-char-default hover:text-paper-blue" />
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
      </Toolbar.Root>
    </nav>
  );
}
