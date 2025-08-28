import * as React from "react";
import { type Section, type Common } from "types";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";
import { ContactButton } from "./button/ContactButton";

export function NavBar({
  commonEn,
  section,
  handleNavTrigger,
}: {
  commonEn: Common;
  section: Section;
  handleNavTrigger: (
    item: Section,
  ) => React.MouseEventHandler<HTMLButtonElement>;
}): React.ReactElement {
  return (
    <nav
      id="nav-bar"
      className="sticky top-6 z-50 flex items-start shrink-0 justify-between h-12 w-full lg:flex-row"
    >
      <NavigationMenu.Root className="flex px-3 py-2 items-center gap-4 rounded-lg bg-panel-default">
        <NavigationMenu.List className="flex p-0 items-center gap-4">
          {commonEn.nav.map((item: Section, index: number) => (
            <NavigationMenu.Item key={index}>
              <NavigationMenu.Trigger
                onClick={handleNavTrigger(item)}
                className={`flex px-2 py-1 items-start gap-0 rounded-sm ${section.name === item.name ? "bg-panel-select" : "bg-panel-default"}`}
              >
                <span
                  className={`font-mono font-medium text-base ${section.name === item.name ? "text-line-focus" : "text-char-default"}`}
                >
                  {`${item.name.slice(0, 1).toUpperCase()}${item.name.slice(1, item.name.length)}`}
                </span>
              </NavigationMenu.Trigger>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
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
