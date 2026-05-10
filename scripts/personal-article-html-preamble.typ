
#show: it => context {
  if target() == "html" {
    html.elem(
      "div",
      attrs: (
        class: "flex flex-col gap-4 font-mono font-normal text-base text-char-default",
      ),
      it,
    )
  } else {
    set page(fill: rgb("#1F1F28"))
    set par(spacing: 2.4em)
    set text(
      font: "JetBrains Mono",
      size: 10pt,
      fill: rgb("#DCD7BA"),
    )
    it
  }
}

// Typst lists
#show list: it => context {
  if target() == "html" {
    html.elem(
      "ul",
      attrs: (class: "list-disc ml-6 space-y-2"),
      it,
    )
  } else {
    it
  }
}

#show enum: it => context {
  if target() == "html" {
    html.elem(
      "ul",
      attrs: (class: "list-decimal list-inside"),
      it,
    )
  } else {
    it
  }
}

// Convert a Typst length into a Tailwind-safe arbitrary value:
// - If it's like "60% + 0pt", strip the + 0pt -> "60%"
// - If it has a non-zero absolute part, wrap as calc(…) and remove spaces -> "calc(60%+12pt)"
#let tw_len(len) = {
  let s = repr(len)

  // Drop trivial + 0pt / + 0px suffixes (Typst tends to emit them)
  let s1 = s
    .replace(" + 0pt", "")
    .replace("+ 0pt", "")
    .replace(" + 0px", "")
    .replace("+ 0px", "")

  // If there is still a '+', we need calc() and must remove spaces for Tailwind arbitrary values
  if s1.contains("+") {
    "calc(" + s1.replace(" ", "") + ")"
  } else {
    s1
  }
}

#show math.equation.where(block: false): it => context {
  if target() == "html" {
    html.elem(
      "span",
      attrs: (
        role: "math",
        class: "font-mono font-normal text-base text-char-default",
      ),
      box(html.frame(text(fill: rgb("#DCD7BA"), it))),
    )
  } else {
    text(
      size: 12pt,
      fill: rgb("#DCD7BA"),
      it,
    )
  }
}

#show math.equation.where(block: true): it => context {
  if target() == "html" {
    html.elem(
      "figure",
      attrs: (
        role: "math",
        class: "font-mono font-normal text-base text-char-default flex flex-col items-center",
      ),
      html.frame(text(fill: rgb("#DCD7BA"), it)),
    )
  } else {
    text(
      size: 12pt,
      fill: rgb("#DCD7BA"),
      it,
    )
  }
}

#show heading: it => context {
  if target() == "html" {
    html.elem(
      "h" + str(it.level),
      attrs: (class: "font-serif font-medium text-lg text-char-default"),
      it.body,
    )
  } else {
    text(
      font: "IBM Plex Serif",
      size: 14pt,
      weight: "medium",
      fill: rgb("#DCD7BA"),
      it,
    )
  }
}

#show quote: it => context {
  if target() == "html" {
    html.elem(
      "blockquote",
      attrs: (
        class: "flex justify-center my-4 font-mono font-normal text-sm text-char-alt",
      ),
      it.body,
    )
  } else {
    [
      #set pad(x: 10em)
      #set align(center)
      #set text(font: "JetBrains Mono", size: 10pt, fill: rgb("#727169"))
      #block(above: 2.4em, below: 2.4em, it.body)
    ]
  }
}

#show figure.where(numbering: none): it => context {
  if target() == "html" {
    html.elem(
      "figure",
      attrs: (class: "typst", data-numbering: "none"),
      it.body,
    )
  } else {
    it.body
  }
}

#show figure.caption: it => context {
  if target() == "html" {
    html.elem(
      "figcaption",
      attrs: (
        class: "typst-caption font-mono font-normal text-sm text-char-alt",
      ),
      it.body,
    )
  } else {
    [
      #set text(font: "JetBrains Mono", fill: rgb("#727169"))
      #set align(left)
      #it.body
    ]
  }
}

// Images: rely on Typst to emit <img> inside the frame
#show image: it => context {
  if target() == "html" {
    let classes = ("typst-image",)

    // Width class
    if it.width != auto {
      let w = tw_len(it.width)
      if w == "100%" {
        classes.push("w-full")
      } else {
        classes.push("w-[" + w + "]") // e.g., w-[90%], w-[calc(60%+12pt)]
      }
    }

    // Height class (optional, same normalization)
    if it.height != auto {
      let h = tw_len(it.height)
      classes.push("h-[" + h + "]")
    }

    html.elem("img", attrs: (
      src: str("/" + it.source),
      class: classes.join(" "),
    ))
  } else {
    it
  }
}

// Grids -> wrapper div; style with CSS for columns/rows/gaps
#show grid: it => context {
  if target() == "html" {
    // Translate columns
    let cols = if type(it.columns) == array {
      // If all tracks are 1fr, compress to grid-cols-N
      if it.columns.all(c => c == 1fr) {
        "grid-cols-" + str(it.columns.len())
      } else {
        // Arbitrary template: grid-cols-[2fr_1fr_…]
        "grid-cols-[" + it.columns.map(repr).join("_") + "]"
      }
    } else {
      ""
    }

    // Translate rows
    let rows = if it.rows == auto {
      // Auto rows sizing (common default)
      "auto-rows-auto"
    } else if type(it.rows) == array {
      // Explicit template: grid-rows-[auto_1fr_…]
      "grid-rows-[" + it.rows.map(repr).join("_") + "]"
    } else {
      ""
    }

    // Compose classes
    let classes = ("grid",)
    if cols != "" { classes.push(cols) }
    if rows != "" { classes.push(rows) }

    html.elem("div", attrs: (class: classes.join(" ")), it)
  } else { it }
}

#show pagebreak: it => {
  if target() == "html" {
    []
  } else {
    it
  }
}
