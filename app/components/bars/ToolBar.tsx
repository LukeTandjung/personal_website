import * as React from "react";
import { type Tool, type Common } from "types";
import { Toolbar } from "@base-ui-components/react/toolbar";
import { ContactButton } from "../button/ContactButton";

export function ToolBar({
  commonEn,
  handleToolTrigger,
}: {
  commonEn: Common;
  handleToolTrigger: (
    name: Tool["name"],
  ) => React.MouseEventHandler<HTMLButtonElement>;
}): React.ReactElement {
  return (
    <nav
      id="tool-bar"
      className="sticky top-6 z-50 flex items-start shrink-0 justify-between h-12 w-full lg:flex-row"
    >
      <Toolbar.Root className="flex px-3 py-2 items-center gap-4 rounded-lg bg-panel-default">
        <Toolbar.Group className="flex p-0 items-center gap-4">
          {commonEn.tool.map(({ name, Icon }: Tool, index: number) => (
            <Toolbar.Button
              key={index}
              onClick={handleToolTrigger(name)}
              className="flex px-2 py-1 items-start gap-0 rounded-sm bg-panel-default hover:bg-panel-select"
            >
              <Icon className="size-4 text-char-default hover:text-line-focus" />
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
      </Toolbar.Root>
      <div className="hidden sm:block">
        <ContactButton
          commonEn={commonEn}
          className="flex p-2 items-center gap-2 rounded-lg border border-solid border-line-unfocus bg-panel-select"
        />
      </div>
      <div className="sm:hidden">
        <ContactButton
          commonEn={commonEn}
          className="fixed bottom-6 left-6 z-50 flex p-2 items-center gap-2 rounded-lg border border-solid border-line-unfocus bg-panel-select shadow-lg"
        />
      </div>
    </nav>
  );
}
