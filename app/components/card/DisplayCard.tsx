import * as React from "react";

export function DisplayCard({
  name,
  icon,
  header,
  description = null,
  children,
}: {
  name: string;
  icon: React.ReactNode;
  header: string;
  description?: string | null;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      id={`${name}-display-card`}
      className="flex p-5 flex-col items-start gap-3 grow self-stretch rounded-lg bg-panel-default/75"
    >
      <header
        id={`${name}-header`}
        className="flex justify-start items-center gap-2 self-stretch"
      >
        {icon}
        <h2 className="font-serif font-medium text-xl text-char-default">
          {header}
        </h2>
      </header>
      <span
        id={`${name}-description`}
        hidden={description !== null ? false : true}
        className="flex justify-start items-center gap-2 self-stretch font-mono font-medium text-sm text-char-alt"
      >
        {description}
      </span>
      <div
        id={`${name}-body`}
        className="flex flex-col items-start gap-3 self-stretch"
      >
        {children}
      </div>
    </div>
  );
}
