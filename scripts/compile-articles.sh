#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_ROOT="${ARTICLE_SOURCE_ROOT:-$HOME/Documents/vault/personal_articles}"
SIMPLEX_PARTS_ROOT="${SIMPLEX_ARTICLE_PARTS_ROOT:-$HOME/Documents/vault/project_draft/simplex_trees/web}"
THEME="$PROJECT_ROOT/scripts/generated/article-theme.typ"
STAGING_ROOT="$(mktemp -d "$PROJECT_ROOT/.article-build.XXXXXX")"

articles=(
  "0|block_to_bits/main.typ|public/articles/0/0/main.html|assets|public/assets/articles/minecraft_ui|/assets/articles/minecraft_ui|= From Blocks to Buttons: Skeuomorphic Principles from Minecraft Building Applied to UI Design"
  "1|zero_knowledge_proof/main.typ|public/articles/1/0/main.html|images|public/assets/articles/zkp|/assets/articles/zkp|= Prerequisites"
  "2|irreverent_learning/main.typ|public/articles/2/0/main.html|-|-|-|= Your Learning Should Be As Irreverent as Possible"
  "3|walk_out_of_cave/main.typ|public/articles/3/0/main.html|-|-|-|= To Walk Out Of The Cave"
)

published_files=()
published_asset_directories=()
cleanup() {
  rm -rf -- "$STAGING_ROOT"
}
trap cleanup EXIT

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command '$1'. Run this inside 'nix develop'." >&2
    exit 1
  fi
}

require_command bun
require_command calepin
require_command typst

if [[ "$(typst --version)" != typst\ 0.15.1* ]]; then
  echo "Expected Typst 0.15.1, got: $(typst --version)" >&2
  exit 1
fi

if [[ "$(calepin --version)" != "calepin 0.0.57" ]]; then
  echo "Expected Calepin 0.0.57, got: $(calepin --version)" >&2
  exit 1
fi

bun run "$PROJECT_ROOT/scripts/generateArticleTypstTheme.ts"

for article in "${articles[@]}"; do
  IFS="|" read -r index source_path output_path asset_path public_asset_path public_asset_url content_marker <<< "$article"

  source="$SOURCE_ROOT/$source_path"
  source_directory="$(dirname "$source")"
  staged_source_directory="$STAGING_ROOT/sources/$index"
  temporary_source="$staged_source_directory/main.typ"
  staged_output="$STAGING_ROOT/publish/$output_path"

  if [[ ! -f "$source" ]]; then
    echo "Missing article $index source: $source" >&2
    exit 1
  fi

  marker_count="$(grep -Fxc "$content_marker" "$source" || true)"
  if [[ "$marker_count" != "1" ]]; then
    echo "Expected one article $index content marker, found $marker_count: $content_marker" >&2
    exit 1
  fi

  mkdir -p "$staged_source_directory"

  # The vault documents still contain their old HTML compatibility preambles.
  # Build an isolated publication entrypoint and leave the vault untouched.
  # Exact content markers make source drift fail loudly instead of truncating at
  # an arbitrary heading. Grid and quote rewrites are temporary compatibility
  # bridges for constructs Typst 0.15 does not map to the intended HTML.
  {
    cat "$THEME"
    echo
    awk -v marker="$content_marker" '$0 == marker { found = 1 } found' "$source" \
      | sed \
        -e 's/article-grid(/__PERSONAL_ARTICLE_GRID__(/g' \
        -e 's/grid(/article-grid(/g' \
        -e 's/__PERSONAL_ARTICLE_GRID__(/article-grid(/g' \
        -e 's/#quote\[/#quote(block: true)[/g'
  } > "$temporary_source"

  typst_arguments=()
  if [[ "$asset_path" != "-" ]]; then
    source_assets="$source_directory/$asset_path"
    staged_source_assets="$staged_source_directory/$asset_path"
    staged_public_assets="$STAGING_ROOT/publish/$public_asset_path"

    if [[ ! -d "$source_assets" ]]; then
      echo "Missing article $index assets: $source_assets" >&2
      exit 1
    fi

    mkdir -p "$staged_source_assets" "$staged_public_assets"
    cp -a "$source_assets/." "$staged_source_assets/"
    cp -a "$source_assets/." "$staged_public_assets/"
    typst_arguments=(-- --input "article-image-root=$public_asset_url")
    published_asset_directories+=("$staged_public_assets|$PROJECT_ROOT/$public_asset_path")
  fi

  mkdir -p "$(dirname "$staged_output")"
  calepin compile "$temporary_source" "$staged_output" \
    --format html \
    --set theme=typst \
    "${typst_arguments[@]}"

  published_files+=("$staged_output|$PROJECT_ROOT/$output_path")
done

simplex_bibliography="$SIMPLEX_PARTS_ROOT/refs.bib"
simplex_staging_directory="$STAGING_ROOT/sources/4"
simplex_staged_parts="$simplex_staging_directory/web"
simplex_assets="$PROJECT_ROOT/public/assets/articles/simplex_trees"
expected_simplex_assets=(
  category_composition.svg
  category_morphism.svg
  facets_cofaces.svg
  filtration.svg
  functor_hierarchy.svg
  graph_vs_simplex.svg
  simplex_dimensions.svg
  simplex_tree.svg
  simplicial_complex.svg
)

if [[ ! -f "$simplex_bibliography" ]]; then
  echo "Missing article 4 bibliography: $simplex_bibliography" >&2
  exit 1
fi
for asset in "${expected_simplex_assets[@]}"; do
  if [[ ! -f "$simplex_assets/$asset" ]]; then
    echo "Missing article 4 diagram: $simplex_assets/$asset" >&2
    exit 1
  fi
done

mkdir -p "$simplex_staged_parts"
cp -L "$simplex_bibliography" "$simplex_staged_parts/refs.bib"
cp "${expected_simplex_assets[@]/#/$simplex_assets/}" "$simplex_staged_parts/"

for part in 0 1 2 3; do
  simplex_part="$SIMPLEX_PARTS_ROOT/$part.typ"
  simplex_part_source="$simplex_staged_parts/$part.typ"
  simplex_part_output="$STAGING_ROOT/publish/public/articles/4/$part/main.html"

  if [[ ! -f "$simplex_part" ]]; then
    echo "Missing article 4 part $part source: $simplex_part" >&2
    exit 1
  fi

  {
    cat "$THEME"
    echo
    cat "$simplex_part"
  } > "$simplex_part_source"

  mkdir -p "$(dirname "$simplex_part_output")"
  calepin compile "$simplex_part_source" "$simplex_part_output" \
    --format html \
    --set theme=typst \
    -- \
    --input "article-image-root=/assets/articles/simplex_trees"

  published_files+=("$simplex_part_output|$PROJECT_ROOT/public/articles/4/$part/main.html")
done

# Publish only after every article compiled successfully. Files are renamed on
# the project filesystem; asset directories are replaced rather than overlaid
# so deleted source assets cannot survive as stale public files.
for publication in "${published_files[@]}"; do
  IFS="|" read -r staged destination <<< "$publication"
  mkdir -p "$(dirname "$destination")"
  mv -f -- "$staged" "$destination"
done

for publication in "${published_asset_directories[@]}"; do
  IFS="|" read -r staged destination <<< "$publication"
  mkdir -p "$(dirname "$destination")"
  rm -rf -- "$destination"
  mv -- "$staged" "$destination"
done

printf 'Compiled %d article parts with native Typst HTML/MathML.\n' "${#published_files[@]}"
