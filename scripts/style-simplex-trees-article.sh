#!/usr/bin/env bash
set -euo pipefail

# Applies the site-specific HTML styling needed for the Simplex Trees article.
# Run from anywhere:
#   bash ~/Projects/personal_website/scripts/style-simplex-trees-article.sh
#
# This intentionally post-processes Typst's HTML output because Typst HTML export
# is still incomplete and currently drops/under-styles some constructs.

SITE_ROOT="${SITE_ROOT:-/home/luke/Projects/personal_website}"
ARTICLE_ROOT="$SITE_ROOT/public/articles/4"
ASSET_ROOT="$SITE_ROOT/public/assets/simplex_trees"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TYPST_PREAMBLE="$SCRIPT_DIR/personal-article-html-preamble.typ"
STYLE_MARKER="// <personal-website-article-style>"

TABLE_BORDER="#727169"
DEFAULT_IMAGE_WIDTH="20rem"
SMALL_IMAGE_WIDTH="14rem"

require_path() {
  if [[ ! -e "$1" ]]; then
    echo "Missing expected path: $1" >&2
    exit 1
  fi
}

style_lists() {
  local file="$1"

  perl -0pi -e \
    's@<ul(?: class="[^"]*")?>@<ul style="list-style-type: disc; padding-left: 1.5rem; margin-left: 1rem;">@g;
     s@<ol(?: class="[^"]*")?>@<ol style="list-style-type: decimal; padding-left: 1.5rem; margin-left: 1rem;">@g;
     s@<li(?: class="[^"]*")?>@<li style="display: list-item; margin-top: 0.5rem;">@g;' \
    "$file"
}

style_tables() {
  local file="$1"

  perl -0pi -e \
    "s@<table(?: class=\"[^\"]*\")?>@<table style=\"border-collapse: collapse; width: 100%; margin: 1rem 0; border: 1px solid $TABLE_BORDER;\">@g;
     s@<th(?: class=\"[^\"]*\")?>@<th style=\"border: 1px solid $TABLE_BORDER; padding: 0.5rem; text-align: left;\">@g;
     s@<td(?: class=\"[^\"]*\")?>@<td style=\"border: 1px solid $TABLE_BORDER; padding: 0.5rem; vertical-align: top;\">@g;" \
    "$file"
}

style_images() {
  local file="$1"

  # Normalize all article diagrams to the default width first.
  perl -0pi -e \
    "s@max-w-\\[[0-9]+rem\\]@max-w-[$DEFAULT_IMAGE_WIDTH]@g" \
    "$file"

  # Some diagrams have a lot of whitespace or are visually too prominent.
  # Keep these smaller while leaving denser diagrams readable.
  perl -0pi -e \
    "s@(<img class=\"[^\"]*)max-w-\\[$DEFAULT_IMAGE_WIDTH\\]([^\"]*\" src=\"/assets/simplex_trees/(category_morphism|category_composition|functor_hierarchy|simplicial_complex|simplex_dimensions)\\.svg\")@\${1}max-w-[$SMALL_IMAGE_WIDTH]\${2}@g" \
    "$file"
}

remove_typst_term_lists() {
  local file="$1"

  # Defensive cleanup for Typst term-list output. The current source uses
  # ZKP-style inline definitions, so this should normally be a no-op.
  perl -0pi -e 's@</?d[ldt][^>]*>@@g' "$file"
}

style_html_file() {
  local file="$1"
  style_lists "$file"
  style_tables "$file"
  style_images "$file"
  remove_typst_term_lists "$file"
}

make_svg_backgrounds_transparent() {
  # Defensive cleanup if an SVG was accidentally rendered with a page background.
  # Does not alter normal vector shapes.
  if [[ -d "$ASSET_ROOT" ]]; then
    find "$ASSET_ROOT" -maxdepth 1 -type f -name '*.svg' -print0 \
      | xargs -0 --no-run-if-empty perl -0pi -e \
        's@<rect([^>]*) fill="(?:white|#ffffff|#fff)"([^>]*)></rect>@@gi;
         s@<rect([^>]*) fill="(?:white|#ffffff|#fff)"([^>]*)/>@@gi;'
  fi
}

write_styled_typst() {
  local source="$1"
  local dest="${2:-}"

  require_path "$source"
  require_path "$TYPST_PREAMBLE"

  if [[ -z "$dest" ]]; then
    dest="$source"
  fi

  if [[ "$source" == "$dest" ]] && grep -qF "$STYLE_MARKER" "$source"; then
    echo "Typst style already present in $source"
    return 0
  fi

  local tmp
  tmp="$(mktemp)"

  {
    echo "$STYLE_MARKER"
    cat "$TYPST_PREAMBLE"
    echo "// </personal-website-article-style>"
    echo
    cat "$source"
  } > "$tmp"

  mv "$tmp" "$dest"
  echo "Wrote styled Typst document to $dest"
}

style_generated_html() {
  require_path "$ARTICLE_ROOT"

  find "$ARTICLE_ROOT" -maxdepth 2 -type f -name 'main.html' -print0 \
    | while IFS= read -r -d '' file; do
        style_html_file "$file"
      done

  make_svg_backgrounds_transparent

  echo "Styled Simplex Trees article HTML under $ARTICLE_ROOT"
}

print_usage() {
  cat <<'USAGE'
Usage:
  style-simplex-trees-article.sh
      Post-process generated article HTML under public/articles/4.

  style-simplex-trees-article.sh --inject-typst-style SOURCE [DEST]
      Prepend the reusable personal-article Typst HTML preamble to SOURCE.
      If DEST is omitted, SOURCE is modified in place. The operation is idempotent
      for in-place writes via a marker comment.

Examples:
  bash scripts/style-simplex-trees-article.sh
  bash scripts/style-simplex-trees-article.sh --inject-typst-style draft.typ .html_parts/styled.typ
USAGE
}

main() {
  case "${1:-}" in
    --inject-typst-style)
      if [[ $# -lt 2 || $# -gt 3 ]]; then
        print_usage >&2
        exit 1
      fi
      write_styled_typst "$2" "${3:-}"
      ;;
    --help|-h)
      print_usage
      ;;
    "")
      style_generated_html
      ;;
    *)
      print_usage >&2
      exit 1
      ;;
  esac
}

main "$@"
