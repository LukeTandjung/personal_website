import * as React from "react";
import { type Tone } from "types";

// Post-it note callout from the paper design system; a slight rotation keeps
// it looking hand-placed. Accent colouring comes from the semantic tone-*
// classes in app.css.
export function Callout({
  tone = "info",
  title,
  rotate = -0.4,
  className,
  children,
}: {
  tone?: Tone;
  title?: string | undefined;
  rotate?: number;
  className?: string | undefined;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className={`tone-${tone} texture-postit rounded-hand bg-cover px-4 py-3 font-mono text-sm text-char-default shadow-paper ${className ?? ""}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {title != null ? (
        <h3 className="mb-1 font-display text-xl leading-tight font-normal text-tone">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}
