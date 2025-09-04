import { Effect, Data } from "effect";

export class ExtractArticleError extends Data.TaggedError(
  "ExtractArticleError",
)<Readonly<{}>> {}

export const extractArticle = (response: Response) =>
  Effect.tryPromise({
    try: () => response.text(),
    catch: () => new ExtractArticleError(),
  });
