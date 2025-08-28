import * as React from "react";
import { type Contact, type Common } from "types";
import { Menu } from "@base-ui-components/react/menu";
import { PhoneIcon } from "@heroicons/react/16/solid";

export function ContactButton({
  commonEn,
  className,
}: {
  commonEn: Common;
  className: string;
}): React.ReactElement {
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className={className}>
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
  );
}
