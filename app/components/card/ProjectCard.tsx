import * as React from "react";
import { type Project } from "types";
import { match } from "ts-pattern";
import { GlobeAltIcon } from "@heroicons/react/16/solid";

export function ProjectCard({
  name,
  type,
  status,
  image_url,
  description,
  project_url,
}: Project & { className?: string }): React.ReactElement {
  // These variables check if image and project urls are present!
  const has_image_src: Boolean = image_url != null && image_url !== "";
  const has_project_href: Boolean = project_url != null && project_url !== "";

  // These variables check what the badge background color should be.
  const badge_bg_color: string = match(status)
    .returnType<string>()
    .with("live", () => "bg-ok")
    .with("in progress", () => "bg-urgent")
    .with("discontinued", () => "bg-warning")
    .exhaustive();

  // This state checks for any errors in the image_url loading,
  // and the fallback message!
  const [error, setError] = React.useState<Boolean>(false);
  const [fallback, setFallback] = React.useState<string>(
    "Designs are still in progress.",
  );

  // If a reload happens or src changes, clear previous error so we can try again
  React.useEffect(() => {
    setError(false);
    setFallback("Designs are still in progress.");
  }, [image_url]);

  return (
    <div className="embla__slide">
      <div
        id={`${name}-project-card`}
        className="flex w-full h-full p-3 flex-col justify-start items-start gap-3 self-stretch rounded-sm bg-panel-alt/75"
      >
        <header
          id={`${name}-project-header`}
          className="flex justify-between items-center self-stretch"
        >
          <h3 className="font-serif font-semibold text-base text-char-default">
            {`${name.slice(0, 1).toUpperCase()}${name.slice(1, name.length)}`}
          </h3>
          <div
            id={`${name}-project-status`}
            className={`flex px-2 py-1 items-center gap-2 rounded-sm ${badge_bg_color}`}
          >
            <span className="font-mono font-normal text-xs text-panel-alt">
              {`${status.slice(0, 1).toUpperCase()}${status.slice(1, status.length)}`}
            </span>
          </div>
        </header>
        <div
          id={`${name}-project-image-frame`}
          className="flex w-full aspect-video justify-center items-center bg-panel-select overflow-hidden"
        >
          {has_image_src && !error ? (
            <img
              src={image_url}
              alt={`This is the UI designs of the ${name} project`}
              onError={() => {
                setError(true);
                setFallback("Designs failed to load.");
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-mono font-normal text-xs text-char-alt">
              {fallback}
            </span>
          )}
        </div>
        <div
          id={`${name}-project-content`}
          className="flex flex-col justify-between items-start grow self-stretch gap-3"
        >
          <div
            id={`${name}-project-description`}
            className="flex items-start self-stretch"
          >
            <p className="font-mono font-normal text-base text-char-alt">
              {description}
            </p>
          </div>
          <footer className="flex justify-end items-start self-stretch">
            <a
              href={project_url}
              className="flex p-2 items-center gap-2 rounded-xs border border-solid border-line-unfocus bg-panel-select"
            >
              <GlobeAltIcon className="size-4 text-char-default" />
              <span className="font-mono font-medium text-base text-char-default">
                {!has_project_href
                  ? "Coming Soon"
                  : type === "open"
                    ? "Source Code"
                    : "Landing Page"}
              </span>
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
