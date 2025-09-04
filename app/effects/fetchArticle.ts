import { Effect, Data } from "effect";
import { type Article } from "types";

export class FetchArticleError extends Data.TaggedError("FetchArticleError")<
  Readonly<{}>
> {}

export const fetchArticle = (
  index: Article["article_index"],
  part: Article["parts"][number],
) =>
  Effect.tryPromise({
    try: () => fetch(`/articles/${index}/${part}/main.html`),
    catch: () => new FetchArticleError(),
  });
