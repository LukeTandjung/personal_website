import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface GeneratedFile {
  path: string;
  content: string;
}

interface ArticleTheme {
  bodyFont: string;
  headingFont: string;
  bodySizePoints: number;
  headingSizePoints: number;
  captionSizePoints: number;
  lineLeadingPoints: number;
  blockSpacingPoints: number;
  background: string;
  foreground: string;
  muted: string;
}

class ArticleThemeError extends Error {}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = resolve(projectRoot, "app/app.css");
const outputPath = resolve(projectRoot, "scripts/generated/article-theme.typ");
const diagramPath = resolve(
  projectRoot,
  "public/assets/articles/simplex_trees",
);
const checkOnly = process.argv.includes("--check");

const formatPoints = (value: number): string =>
  `${Number(value.toFixed(3))}pt`;

const generateTheme = (css: string): ArticleTheme | ArticleThemeError => {
  const declarations = new Map(
    Array.from(css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)).flatMap(
      (match): Array<[string, string]> => {
        const name = match[1];
        const value = match[2];
        return name === undefined || value === undefined
          ? []
          : [[name, value.trim()]];
      },
    ),
  );

  const resolveProperty = (
    name: string,
    visited: ReadonlySet<string> = new Set(),
  ): string | ArticleThemeError => {
    if (visited.has(name)) {
      return new ArticleThemeError(`Circular CSS variable reference: ${name}`);
    }

    const value = declarations.get(name);
    if (value === undefined) {
      return new ArticleThemeError(`Missing CSS variable: ${name}`);
    }

    const reference = /^var\((--[\w-]+)\)$/.exec(value);
    if (reference === null) return value;

    const referencedName = reference[1];
    if (referencedName === undefined) {
      return new ArticleThemeError(`Invalid CSS variable reference: ${value}`);
    }

    return resolveProperty(referencedName, new Set([...visited, name]));
  };

  const fontName = (name: string): string | ArticleThemeError => {
    const value = resolveProperty(name);
    if (value instanceof ArticleThemeError) return value;

    const quotedFont = /["']([^"']+)["']/.exec(value)?.[1];
    const firstFont = quotedFont ?? value.split(",").at(0)?.trim();
    return firstFont === undefined || firstFont.length === 0
      ? new ArticleThemeError(`Invalid font value for ${name}: ${value}`)
      : firstFont;
  };

  const pixelLength = (name: string): number | ArticleThemeError => {
    const value = resolveProperty(name);
    if (value instanceof ArticleThemeError) return value;

    const match = /^([0-9]+(?:\.[0-9]+)?)px$/.exec(value);
    if (match?.[1] === undefined) {
      return new ArticleThemeError(`${name} must be a pixel length, got: ${value}`);
    }

    return Number(match[1]);
  };

  const numericValue = (name: string): number | ArticleThemeError => {
    const value = resolveProperty(name);
    if (value instanceof ArticleThemeError) return value;

    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : new ArticleThemeError(`${name} must be numeric, got: ${value}`);
  };

  const colorValue = (name: string): string | ArticleThemeError => {
    const value = resolveProperty(name);
    if (value instanceof ArticleThemeError) return value;

    return /^#[0-9a-fA-F]{6}$/.test(value)
      ? value.toLowerCase()
      : new ArticleThemeError(`${name} must be a six-digit hex color, got: ${value}`);
  };

  const bodyFont = fontName("--article-font-body");
  if (bodyFont instanceof ArticleThemeError) return bodyFont;
  const headingFont = fontName("--article-font-heading");
  if (headingFont instanceof ArticleThemeError) return headingFont;
  const bodySizePixels = pixelLength("--article-body-size");
  if (bodySizePixels instanceof ArticleThemeError) return bodySizePixels;
  const headingSizePixels = pixelLength("--article-heading-size");
  if (headingSizePixels instanceof ArticleThemeError) return headingSizePixels;
  const captionSizePixels = pixelLength("--article-caption-size");
  if (captionSizePixels instanceof ArticleThemeError) return captionSizePixels;
  const lineHeight = numericValue("--article-line-height");
  if (lineHeight instanceof ArticleThemeError) return lineHeight;
  const blockSpacing = resolveProperty("--article-block-spacing");
  if (blockSpacing instanceof ArticleThemeError) return blockSpacing;
  const background = colorValue("--color-paper-bg");
  if (background instanceof ArticleThemeError) return background;
  const foreground = colorValue("--color-char-default");
  if (foreground instanceof ArticleThemeError) return foreground;
  const muted = colorValue("--color-char-muted");
  if (muted instanceof ArticleThemeError) return muted;

  const blockSpacingMatch = /^([0-9]+(?:\.[0-9]+)?)rem$/.exec(blockSpacing);
  if (blockSpacingMatch?.[1] === undefined) {
    return new ArticleThemeError(
      `--article-block-spacing must be a rem length, got: ${blockSpacing}`,
    );
  }

  const pixelsToPoints = (pixels: number): number => pixels * 0.75;
  const bodySizePoints = pixelsToPoints(bodySizePixels);

  return {
    bodyFont,
    headingFont,
    bodySizePoints,
    headingSizePoints: pixelsToPoints(headingSizePixels),
    captionSizePoints: pixelsToPoints(captionSizePixels),
    lineLeadingPoints: bodySizePoints * (lineHeight - 1),
    blockSpacingPoints:
      bodySizePoints * Number(blockSpacingMatch[1]),
    background,
    foreground,
    muted,
  };
};

readFile(cssPath, "utf8")
  .then((css): Promise<Array<GeneratedFile>> => {
    const theme = generateTheme(css);
    if (theme instanceof ArticleThemeError) return Promise.reject(theme);

    const generatedTypst = `// Generated from app/app.css by scripts/generateArticleTypstTheme.ts.
// Do not edit this file directly.

#let personal-article(doc) = context {
  if target() == "html" {
    doc
  } else {
    set page(fill: rgb(${JSON.stringify(theme.background)}))
    set par(
      leading: ${formatPoints(theme.lineLeadingPoints)},
      spacing: ${formatPoints(theme.blockSpacingPoints)},
    )
    set text(
      font: ${JSON.stringify(theme.bodyFont)},
      size: ${formatPoints(theme.bodySizePoints)},
      fill: rgb(${JSON.stringify(theme.foreground)}),
    )
    show heading: set text(
      font: ${JSON.stringify(theme.headingFont)},
      size: ${formatPoints(theme.headingSizePoints)},
      weight: "medium",
      fill: rgb(${JSON.stringify(theme.foreground)}),
    )
    show quote: set text(
      size: ${formatPoints(theme.captionSizePoints)},
      fill: rgb(${JSON.stringify(theme.muted)}),
    )
    show figure.caption: set text(
      size: ${formatPoints(theme.captionSizePoints)},
      fill: rgb(${JSON.stringify(theme.muted)}),
    )
    doc
  }
}

#show: personal-article

// Alignment is visual rather than semantic in HTML; CSS owns centering while
// Typst must still preserve the aligned content.
#show align: it => context {
  if target() == "html" { it.body } else { it }
}

// Typst 0.15 still has no semantic HTML rule for layout grids. Sources use
// this small cross-target helper until native support lands.
#let article-grid(..arguments) = context {
  if target() == "html" {
    let columns = arguments.named().at("columns", default: 1)
    let template = if type(columns) == array {
      columns.map(repr).join(" ")
    } else {
      "repeat(" + str(columns) + ", minmax(0, 1fr))"
    }
    block(html.elem(
      "div",
      attrs: (
        class: "typst-grid",
        style: "grid-template-columns: " + template + ";",
      ),
      arguments.pos().join(),
    ))
  } else {
    grid(..arguments)
  }
}

// Diagrams use explicit semantic classes whose dimensions are owned by the
// shared CSS design tokens.
#let article-diagram(source, alt: none, compact: false) = context {
  if target() == "html" {
    let public-root = sys.inputs.at("article-image-root", default: "")
    let class = "typst-diagram"
    if compact {
      class += " typst-diagram--compact"
    }
    block(html.elem(
      "img",
      attrs: (
        src: public-root + "/" + str(source).split("/").last(),
        alt: alt,
        class: class,
      ),
    ))
  } else {
    image(source, alt: alt)
  }
}

// Typst's native HTML image rule embeds files as base64. Keep article assets
// cacheable and independently addressable using the public root supplied by
// the build script. Visual styling remains in app/app.css.
#show image: it => context {
  if target() == "html" {
    let source = str(it.source)
    let public-root = sys.inputs.at("article-image-root", default: "")
    let attrs = (
      src: public-root + "/" + source.split("/").last(),
      class: sys.inputs.at(
        "article-image-class",
        default: "typst-article-image",
      ),
    )
    if it.alt != none {
      attrs.insert("alt", it.alt)
    }

    let styles = ()
    if it.width != auto {
      let width = repr(it.width)
        .replace(" + 0pt", "")
        .replace("+ 0pt", "")
      styles.push("width: " + width + ";")
    }
    if it.height != auto {
      let height = repr(it.height)
        .replace(" + 0pt", "")
        .replace("+ 0pt", "")
      styles.push("height: " + height + ";")
    }
    if styles.len() > 0 {
      attrs.insert("style", styles.join(" "))
    }

    block(html.elem("img", attrs: attrs))
  } else {
    it
  }
}

// Page breaks are meaningful in paged output only.
#show pagebreak: it => if target() == "html" { [] } else { it }
`;

    return readdir(diagramPath, { withFileTypes: true })
      .then((entries) =>
        Promise.all(
          entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
            .map((entry): Promise<GeneratedFile> =>
              readFile(resolve(diagramPath, entry.name), "utf8").then(
                (content) => {
                  if (!content.includes("data-article-foreground-")) {
                    throw new ArticleThemeError(
                      `${entry.name} has no semantic article foreground markers`,
                    );
                  }

                  return {
                    path: resolve(diagramPath, entry.name),
                    content: content
                      .replace(
                        /(data-article-foreground-fill=""\s+fill=")#[0-9a-f]{6}"/gi,
                        `$1${theme.foreground}"`,
                      )
                      .replace(
                        /(data-article-foreground-stroke=""\s+stroke=")#[0-9a-f]{6}"/gi,
                        `$1${theme.foreground}"`,
                      ),
                  };
                },
              ),
            ),
        ),
      )
      .then((diagrams): Array<GeneratedFile> => [
        { path: outputPath, content: generatedTypst },
        ...diagrams,
      ]);
  })
  .then((generated): Promise<void> => {
    if (!checkOnly) {
      return Promise.all(
        generated.map((file) =>
          mkdir(dirname(file.path), { recursive: true }).then(() =>
            writeFile(file.path, file.content, "utf8"),
          ),
        ),
      ).then(() => undefined);
    }

    return Promise.all(
      generated.map((file) =>
        readFile(file.path, "utf8").then((existing) =>
          existing === file.content ? undefined : file.path,
        ),
      ),
    ).then((staleFiles) => {
      const stale = staleFiles.filter((path) => path !== undefined);
      if (stale.length > 0) {
        return Promise.reject(
          new ArticleThemeError(
            `Generated article theme files are stale: ${stale.join(", ")}`,
          ),
        );
      }
    });
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
