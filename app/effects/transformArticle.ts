import { Effect, Data } from "effect";
import { type Article } from "types";

export class TransformArticleError extends Data.TaggedError(
  "TransformArticleError",
)<Readonly<{}>> {}

export const transformArticle = (
  html: string,
  cancelled: boolean,
  article: {
    index: Article["article_index"];
    part: Article["parts"][number];
    source: string;
  },
) =>
  Effect.try({
    try: () => {
      if (cancelled) return article;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const source = doc.body && doc.body.innerHTML ? doc.body.innerHTML : html;
      return { ...article, source };
    },
    catch: () => new TransformArticleError(),
  });
