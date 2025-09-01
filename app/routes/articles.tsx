import * as React from "react";
import type { Route } from "./+types/articles";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import { type Tool } from "types";
import { ToolBar } from "components";
import { commonEn } from "locales";
import { match, P } from "ts-pattern";
import { TypstDocument } from "@myriaddreamin/typst.react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Articles - Luke" },
    { name: "description", content: "These are Luke's articles" },
  ];
}

export default function Articles() {
  // Initialises three hooks
  const navigate: NavigateFunction = useNavigate();
  const { index, part } = useParams();

  // Tracks the current article and the part of the article user is looking at via useMemo
  const [article, setArticle] = React.useState<{
    index: number | null;
    part: number | null;
    source: Uint8Array;
  }>({
    index: null,
    part: null,
    source: new Uint8Array(0),
  });

  // This state tracks for mounting under SSR rendering
  const [mounted, setMounted] = React.useState<boolean>(false);

  const handleToolTrigger = (
    name: Tool["name"],
  ): React.MouseEventHandler<HTMLButtonElement> => {
    return () => {
      match({ name })
        .returnType<void>()
        .with({ name: "menu" }, () => {
          navigate("/");
        })
        .with(
          {
            name: P.union("back", "next"),
            article: { index: P.number, part: P.number },
          },
          ({ name, article }) => {
            const nextPart =
              name === "back" ? article.part - 1 : article.part + 1;
            navigate(`/articles/${article.index}/part/${nextPart}`);
          },
        )
        .otherwise(() => {
          navigate("/");
        });
    };
  };
  React.useEffect(() => {
    TypstDocument.setWasmModuleInitOptions({
      beforeBuild: [],
      getModule: () =>
        "/node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm",
    });

    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (
      (index !== undefined || index !== null) &&
      (part !== undefined || part !== null)
    ) {
      (async () => {
        const source: ArrayBuffer | Uint8Array<ArrayBufferLike> = await fetch(
          `/articles/${index}/${part}/main.in`,
        ).then((response) => response.arrayBuffer());

        setArticle({
          index: Number(index),
          part: Number(part),
          source: new Uint8Array(source),
        });
      })();
    }
  }, [index, part]);

  return (
    <div className="h-full p-6 gap-6">
      <ToolBar {...{ commonEn, handleToolTrigger }} />
      <div className="h-full px-[5vw] mt-4">
        {mounted && article.source ? (
          <TypstDocument
            fill="#343541"
            artifact={article.source}
            format="json"
          />
        ) : null}
      </div>
    </div>
  );
}
