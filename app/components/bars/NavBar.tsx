import * as React from "react";
import { Match } from "effect";
import { type Section, type Common } from "types";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";

// Paper folder links hanging off the top edge of the paper sheet. The
// Navigation Menu models page navigation without the focus behavior of tabs.
export function NavBar({
  commonEn,
  section,
  handleNavTrigger,
}: {
  commonEn: Common;
  section: Section;
  handleNavTrigger: (item: Section) => void;
}): React.ReactElement {
  return (
    <NavigationMenu.Root aria-label="Page sections">
      <NavigationMenu.List className="flex items-end gap-[3px] px-1 font-mono text-[13px] sm:px-2">
        {commonEn.nav.map((item: Section) => (
          <NavigationMenu.Item key={item.name}>
            <NavigationMenu.Link
              href={`#${item.name}`}
              aria-current={
                section.name === item.name ? "location" : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                // Mobile browsers can keep a focused off-screen link visible,
                // fighting the section scroll. Release focus before navigating.
                event.currentTarget.blur();
                handleNavTrigger(item);
              }}
              className={`${Match.value(item.name).pipe(
                Match.when("about", () => "bg-tint-yellow"),
                Match.when("articles", () => "bg-tint-blue"),
                Match.when("contacts", () => "bg-tint-green"),
                Match.exhaustive,
              )} texture-grain flex min-h-11 cursor-pointer items-center rounded-tab border border-line-default !text-char-default transition-all hover:!opacity-100 sm:min-h-0 sm:hover:pt-2 sm:hover:pb-[7px] ${
                section.name === item.name
                  ? "-mb-px border-b-transparent px-4 pt-2 pb-[7px] font-bold opacity-100 shadow-[0_-1px_2px_rgba(85,85,85,0.1)] sm:px-[18px]"
                  : "px-3 pt-[5px] pb-1 font-normal opacity-75 sm:px-3.5"
              }`}
            >
              {item.name}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
