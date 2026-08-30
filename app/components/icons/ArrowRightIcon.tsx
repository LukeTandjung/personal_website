import * as React from "react";

// "solid-arrow-right" from https://koboyo.com/icons/solid-arrow-right
// (free for commercial use, no attribution)
export function ArrowRightIcon(
  props: React.SVGProps<SVGSVGElement>,
): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 -37 233 233"
      aria-hidden="true"
      {...props}
    >
      <g transform="translate(0,159) scale(0.1,-0.1)">
        <path d="M1259 1381 c-39 -40 -39 -95 3 -223 25 -76 30 -103 22 -116 -10 -16 -53 -18 -495 -23 -537 -7 -545 -7 -587 -70 -22 -32 -23 -41 -20 -169 4 -155 15 -186 75 -216 36 -18 64 -19 525 -15 380 3 491 1 503 -9 19 -16 19 -63 0 -126 -8 -27 -18 -79 -21 -116 -6 -62 -5 -68 19 -92 34 -34 82 -34 147 -1 77 39 586 381 636 427 82 76 101 144 65 225 -24 51 -66 85 -331 265 -113 76 -241 164 -285 195 -146 101 -204 116 -256 64z" />
      </g>
    </svg>
  );
}
