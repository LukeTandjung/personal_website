import * as React from "react";
import { type Section, type Contact, type Common } from "types";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";
import { Menu } from "@base-ui-components/react/menu";
import { PhoneIcon } from "@heroicons/react/16/solid";

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
      className="sticky top-6 z-50 flex items-start shrink-0 justify-between h-12 w-full"
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
      <Menu.Root modal={false}>
        <Menu.Trigger className="flex p-2 items-center gap-2 rounded-lg border border-solid border-line-unfocus bg-panel-select">
          <PhoneIcon className="size-4 text-char-default" />
          <span className="font-mono font-medium text-base text-char-default">
            Contacts
          </span>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner align="start" sideOffset={4}>
            <Menu.Popup className="flex p-2 flex-col items-start gap-2 self-stretch rounded-lg bg-panel-select min-w-[117px]">
              {commonEn.contacts.map(
                ({ name, Icon, href }: Contact, index: number) => (
                  <Menu.Item
                    onClick={() => {
                      window.location.assign(href);
                    }}
                    key={index}
                    className="flex p-0 items-center gap-2 self-stretch"
                  >
                    <Icon className="size-4 text-char-default" />
                    <span className="font-mono font-medium text-base text-char-default">
                      {`${name.slice(0, 1).toUpperCase()}${name.slice(1, name.length)}`}
                    </span>
                  </Menu.Item>
                ),
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </nav>
  );
}
