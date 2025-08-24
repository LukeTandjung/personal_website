import * as React from "react";
import { type Section, type Interest, type Article } from "types";
import {
  QuestionMarkCircleIcon,
  Square3Stack3DIcon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import { NavBar, DisplayCard, Carousel, ArticleCard } from "components";
import { commonEn } from "locales";
import { match } from "ts-pattern";

export function Welcome() {
  // Tracks the current section of the website the user is looking at via a React state
  const [section, setSection] = React.useState<Section>({ name: "about" });

  // These React refs are used to modify the DOM to scroll into view for each section
  const about = React.useRef<HTMLElement>(null);
  const projects = React.useRef<HTMLElement>(null);
  const articles = React.useRef<HTMLElement>(null);

  const handleNavTrigger = (item: Section) => {
    return () => {
      let ref: React.RefObject<HTMLElement | null> = match(item)
        .returnType<React.RefObject<HTMLElement | null>>()
        .with({ name: "about" }, () => about)
        .with({ name: "projects" }, () => projects)
        .with({ name: "articles" }, () => articles)
        .exhaustive();

      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setSection(item);
    };
  };

  return (
    <div className="flex flex-col min-h-dvh p-6 gap-6">
      <NavBar {...{ commonEn, section, handleNavTrigger }} />
      <main id="main" className="flex flex-1 flex-col gap-6 self-stretch">
        <section
          ref={about}
          id="about-section"
          className="grid grid-rows-[1fr_1fr] h-full gap-6 self-stretch min-h-0"
        >
          <header className="flex justify-center items-center">
            <h1 className="text-char-default font-display text-5xl font-normal">
              Hello! I am Luke
            </h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            <div
              id="left-side"
              className="flex w-full md:basis-1/2 md:min-w-0 flex-col items-start gap-6 self-stretch"
            >
              <div
                id="about-card"
                className="flex p-5 items-start flex-col gap-3 self-stretch rounded-lg bg-panel-default/75"
              >
                {commonEn.introduction.map((item: string, index: number) => (
                  <p
                    key={index}
                    className="font-mono font-normal text-base text-char-default"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <DisplayCard
                name="technical-interest"
                icon={
                  <QuestionMarkCircleIcon className="size-6 text-char-default" />
                }
                header="Technical Interests"
              >
                <ul className="flex items-start content-start gap-3 grow self-stretch flex-wrap list-none">
                  {commonEn.interests.map(
                    ({ name, Icon }: Interest, index: number) => (
                      <li
                        key={index}
                        className="flex p-2 items-center gap-2 rounded-sm bg-panel-alt"
                      >
                        <Icon className="size-4 text-char-default" />
                        <span className="font-mono font-normal text-base text-char-default">
                          {name}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </DisplayCard>
            </div>
            <div
              id="right-side"
              className="flex w-full md:basis-1/2 md:min-w-0 flex-col items-start gap-0 self-stretch"
            >
              <DisplayCard
                name="tech-stack"
                icon={
                  <Square3Stack3DIcon className="size-6 text-char-default" />
                }
                header="Personal Tech Stack"
                description="I am open to working in any tech stack; this is just the stack I
                use for my personal projects."
              >
                {Object.entries(commonEn.stack).map(
                  (
                    [key, value]: [key: string, value: Array<string>],
                    index: number,
                  ) => (
                    <div
                      key={index}
                      className="flex p-3 flex-col justify-center items-start gap-3 self-stretch rounded-sm bg-panel-alt/75"
                    >
                      <header>
                        <h3 className="font-mono font-semibold text-base text-char-default">
                          {`${key.slice(0, 1).toUpperCase()}${key.slice(1, key.length)}`}
                        </h3>
                      </header>
                      <body>
                        <ul className="flex items-start content-start gap-3 self-stretch flex-wrap">
                          {value.map((item: string, index: number) => (
                            <li
                              key={index}
                              className="flex px-2 py-1 items-center gap-2 rounded-sm border border-solid border-line-unfocus bg-panel-select font-mono font-normal text-sm text-line-focus"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </body>
                    </div>
                  ),
                )}
              </DisplayCard>
            </div>
          </div>
        </section>
        <section
          ref={projects}
          id="projects-section"
          className="flex items-start gap-6 self-stretch"
        >
          <DisplayCard
            name="projects"
            icon={
              <WrenchScrewdriverIcon className="size-6 text-char-default" />
            }
            header="Projects"
            description="Some of these projects are still in progress."
          >
            <Carousel commonEn={commonEn} />
          </DisplayCard>
        </section>
        <section
          ref={articles}
          id="articles-section"
          className="flex items-start gap-6 self-stretch"
        >
          <DisplayCard
            name="articles"
            icon={<NewspaperIcon className="size-6 text-char-default" />}
            header="Articles"
            description="Technical writings about software, math, and random thoughts."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start content-start gap-3 grow self-stretch flex-wrap">
              {commonEn.articles.map((item: Article, index: number) => (
                <ArticleCard key={index} {...item} />
              ))}
            </div>
          </DisplayCard>
        </section>
      </main>
    </div>
  );
}
