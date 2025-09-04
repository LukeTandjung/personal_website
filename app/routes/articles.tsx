import * as React from "react";
import type { Route } from "./+types/articles";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import { type Tool, type Article } from "types";
import { ToolBar } from "components";
import { commonEn } from "locales";
import { Effect, Match } from "effect";
import {
  fetchArticle,
  FetchArticleError,
  extractArticle,
  transformArticle,
} from "effects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Articles - Luke" },
    { name: "description", content: "These are Luke's articles" },
  ];
}

export default function Articles() {
  // Initialises two hooks for React Router navigation and grabbing URL params.
  const navigate: NavigateFunction = useNavigate();
  const { index, part } = useParams();

  // Initialises two refs for the backward and forward page button.
  const back_ref = React.useRef<HTMLButtonElement>(null);
  const next_ref = React.useRef<HTMLButtonElement>(null);

  // Tracks the current article and the part of the article user is looking at via useMemo.
  const [article, setArticle] = React.useState<{
    index: Article["article_index"];
    part: Article["parts"][number];
    source: string;
  }>({
    index: undefined,
    part: 0,
    source: "",
  });

  const handleToolTrigger = (
    name: Tool["name"],
  ): React.MouseEventHandler<HTMLButtonElement> => {
    return () => {
      const nav_invoke: void | Promise<void> = Match.value(name).pipe(
        Match.withReturnType<void | Promise<void>>(),
        Match.when("menu", () => navigate("/")),
        Match.when(Match.is("back", "next"), () => {
          navigate(
            `/articles/${article.index}/part/${name === "back" ? article.part - 1 : article.part + 1}`,
          );
        }),
        Match.exhaustive,
      );

      nav_invoke;
    };
  };

  React.useEffect(() => {
    if (index != null && part != null) {
      setArticle({ ...article, index: Number(index), part: Number(part) });
    }
  }, [index, part]);

  React.useEffect(() => {
    let cancelled = false;

    if (article.index != null && article.part != null) {
      // The first half of the logic disables the forward and backward ref if necessary.
      const article_parts: Array<number> | undefined = commonEn.articles.find(
        (article_object: Article) =>
          article_object.article_index === article.index,
      )?.parts;

      if (article_parts != null && back_ref.current !== null) {
        if (article.part === article_parts.at(0)) {
          back_ref.current.setAttribute("hidden", "true");
        } else {
          back_ref.current.removeAttribute("hidden");
        }
      }

      if (article_parts != null && next_ref.current !== null) {
        if (article.part === article_parts.at(-1)) {
          next_ref.current.setAttribute("hidden", "true");
        } else {
          next_ref.current.removeAttribute("hidden");
        }
      }

      // The second half of the logic inside here handles article fetching and ETL to paint the page!
      Effect.runPromise(
        fetchArticle(article.index, article.part).pipe(
          Effect.filterOrFail(
            (response) => response.ok,
            () => new FetchArticleError(),
          ),
          Effect.flatMap(extractArticle),
          Effect.flatMap((html) => transformArticle(html, cancelled, article)),
          Effect.tap((updated) => Effect.sync(() => setArticle(updated))),
          Effect.catchTags({
            FetchArticleError: () =>
              Effect.succeed(
                "This article either does not exist, or the corresponding part of this article has not been published yet, Stay tuned!",
              ),
            ExtractArticleError: () =>
              Effect.succeed(
                "There was a problem extracting the text of the article.",
              ),
            TransformArticleError: () =>
              Effect.succeed(
                "There was a problem transforming the text of the article.",
              ),
          }),
        ),
      );
    }

    return () => {
      cancelled = true;
    };
  }, [article.index, article.part]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-4">
      <ToolBar {...{ commonEn, handleToolTrigger, back_ref, next_ref }} />
      {article.source ? (
        <div
          id="article-content-card"
          className="flex p-5 justify-center items-center flex-col sm:max-w-3/4 lg:max-w-5/8 rounded-lg bg-panel-default/75"
          dangerouslySetInnerHTML={{ __html: article.source }}
        />
      ) : null}
    </div>
  );
}
