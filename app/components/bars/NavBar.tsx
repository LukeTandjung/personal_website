import * as React from "react";
import { Match } from "effect";
import { type Section, type Common } from "types";
import { Tabs } from "@base-ui-components/react/tabs";

// Paper folder tabs hanging off the top edge of the paper sheet. Each tab is
// tinted like a stationery divider; the selected tab lifts up and merges with
// the sheet below it.
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
    <Tabs.Root
      value={section.name}
      onValueChange={(value) => {
        const item = commonEn.nav.find((nav: Section) => nav.name === value);
        if (item != null) handleNavTrigger(item);
      }}
    >
      <Tabs.List className="flex items-end gap-[3px] px-1 font-mono text-[13px] sm:px-2">
        {commonEn.nav.map((item: Section) => (
          <Tabs.Tab
            key={item.name}
            value={item.name}
            className={`${Match.value(item.name).pipe(
              Match.when("about", () => "bg-tint-yellow"),
              Match.when("articles", () => "bg-tint-blue"),
              Match.when("contacts", () => "bg-tint-green"),
              Match.exhaustive,
            )} texture-grain min-h-11 cursor-pointer rounded-tab border border-line-default text-char-default transition-all hover:opacity-100 sm:min-h-0 sm:hover:pt-2 sm:hover:pb-[7px] ${
              section.name === item.name
                ? "-mb-px border-b-transparent px-4 pt-2 pb-[7px] font-bold opacity-100 shadow-[0_-1px_2px_rgba(85,85,85,0.1)] sm:px-[18px]"
                : "px-3 pt-[5px] pb-1 font-normal opacity-75 sm:px-3.5"
            }`}
          >
            {item.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
