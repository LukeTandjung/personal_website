import * as React from "react";
import { Match } from "effect";
import type { Route } from "./+types/home";
import { type Section, type Photo, type Contact, type Article } from "types";
import {
  NavBar,
  Callout,
  PolaroidPhoto,
  ProjectDeck,
  ArticleCard,
} from "components";
import { commonEn } from "locales";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - Luke" },
    { name: "description", content: "Welcome to Luke's personal website!" },
  ];
}

export default function Home() {
  // Tracks the current section of the website the user is looking at via a React state
  const [section, setSection] = React.useState<Section>({ name: "about" });
  // Which polaroid photo is zoomed in (opens its dialog)
  const [inspected, setInspected] = React.useState<number | null>(null);
  // Whether the stardust mascot is mid-spin from a click
  const [spinning, setSpinning] = React.useState<boolean>(false);
  // Edge photos become an in-page gallery below the desktop breakpoint.
  const [embeddedPhotos, setEmbeddedPhotos] = React.useState<boolean>(false);

  // These React refs are used to modify the DOM to scroll into view for each section
  const about = React.useRef<HTMLElement>(null);
  const articles = React.useRef<HTMLElement>(null);
  const contacts = React.useRef<HTMLElement>(null);

  const sectionRef = (
    name: Section["name"],
  ): React.RefObject<HTMLElement | null> =>
    Match.value(name).pipe(
      Match.when("about", () => about),
      Match.when("articles", () => articles),
      Match.when("contacts", () => contacts),
      Match.exhaustive,
    );

  const handleNavTrigger = (item: Section): void => {
    sectionRef(item.name).current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setSection(item);
  };

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const handleLayoutChange = (): void => {
      setEmbeddedPhotos(media.matches);
      setInspected(null);
    };
    handleLayoutChange();
    media.addEventListener("change", handleLayoutChange);
    return () => {
      media.removeEventListener("change", handleLayoutChange);
    };
  }, []);

  // Scroll-spy: highlight the tab of the section under the top of the viewport,
  // and put any zoomed photo back once the page scrolls.
  React.useEffect(() => {
    const handleScroll = (): void => {
      const current = [about, articles, contacts].reduce(
        (found: Section, ref, index) => {
          const names: Array<Section["name"]> = ["about", "articles", "contacts"];
          if (
            ref.current !== null &&
            ref.current.getBoundingClientRect().top < 140
          ) {
            return { name: names[index] };
          }
          return found;
        },
        { name: "about" },
      );
      setSection((previous) =>
        previous.name === current.name ? previous : current,
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pinned = commonEn.photos
    .map((photo: Photo, index: number) => ({ photo, index }))
    .filter(({ photo }) => photo.inline !== true);
  const inline = commonEn.photos
    .map((photo: Photo, index: number) => ({ photo, index }))
    .filter(({ photo }) => photo.inline === true);

  return (
    <div className="min-h-dvh text-[15px] leading-normal">
      {/* Fixed sky backdrop behind the paper sheet */}
      <div className="fixed inset-0 z-0 bg-[#2a68a6]">
        <img
          src="/assets/site/sky.webp"
          alt=""
          className="absolute bottom-0 left-0 block h-auto w-full"
        />
      </div>
      <div className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-[920px] flex-col px-2 sm:px-4 lg:px-0">
        <nav className="h-20 sm:h-24" aria-hidden="true" />
        {/* The paper sheet */}
        <div
          className="relative flex-1 origin-top border border-b-0 border-line-default bg-paper-bg bg-[url(/assets/design/paper_texture_4k.png)] bg-[length:1200px_auto] bg-blend-multiply opacity-[0.97] shadow-lift lg:rotate-[0.6deg]"
        >
          <div className="absolute top-0 right-8 -translate-y-full">
            <NavBar {...{ commonEn, section, handleNavTrigger }} />
          </div>
          {/* Polaroids pinned around the sheet edges */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {pinned.map(({ photo, index }) => (
              <PolaroidPhoto
                key={photo.caption}
                photo={photo}
                open={!embeddedPhotos && inspected === index}
                onOpenChange={(open) => setInspected(open ? index : null)}
              />
            ))}
          </div>
          <main className="relative flex flex-col gap-14 px-4 pt-10 pb-36 sm:px-8 sm:pt-14 sm:pb-28 lg:gap-[72px] lg:pb-20">
            <header
              ref={about}
              id="about"
              className="grid grid-cols-1 items-start gap-9 md:grid-cols-[5fr_4fr] md:gap-12"
            >
              <div className="flex flex-col gap-8">
                <h1 className="font-display text-5xl leading-[1.08] font-normal tracking-[0.01em] text-char-default sm:text-[56px]">
                  I'm Luke<span className="text-paper-red">.</span>
                </h1>
                <div className="md:hidden">
                  <p className="mb-3.5 text-pretty text-char-default">
                    {commonEn.introduction[0]}
                  </p>
                  <p className="text-pretty text-char-muted">
                    {commonEn.introduction[1]}
                  </p>
                </div>
                <Callout tone="info" rotate={-3} className="w-full max-w-[280px]">
                  <h3 className="mb-2 font-display text-[15px] font-normal">
                    Technical interests
                  </h3>
                  <ul className="flex list-none flex-col gap-1.5 text-sm">
                    {commonEn.interests.map((interest: string) => (
                      <li key={interest}>· {interest}</li>
                    ))}
                  </ul>
                </Callout>
                <div className="flex flex-wrap items-end justify-center gap-6 sm:justify-end">
                  {inline.map(({ photo, index }) => (
                    <PolaroidPhoto
                      key={photo.caption}
                      photo={photo}
                      open={inspected === index}
                      onOpenChange={(open) => setInspected(open ? index : null)}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-0 md:pt-3.5">
                <div className="hidden md:block">
                  <p className="mb-3.5 text-pretty text-char-default">
                    {commonEn.introduction[0]}
                  </p>
                  <p className="text-pretty text-char-muted">
                    {commonEn.introduction[1]}
                  </p>
                  <div className="h-14" />
                </div>
                <Callout tone="warning" rotate={2} className="w-full max-w-[280px]">
                  <h3 className="mb-2 font-display text-base font-normal">
                    Recommended books
                  </h3>
                  <ul className="flex list-none flex-col gap-1.5 text-[13px]">
                    {commonEn.books.map((book: string) => (
                      <li key={book}>· {book}</li>
                    ))}
                  </ul>
                </Callout>
                <div className="relative mt-7 h-32 overflow-visible md:mt-0 md:h-0">
                  <div className="absolute top-0 left-0 flex items-start gap-3.5 md:top-11">
                    <img
                      src="/assets/site/stardust.png"
                      alt="stardust, the site mascot"
                      onClick={() => {
                        if (spinning) return;
                        setSpinning(true);
                        setTimeout(() => setSpinning(false), 950);
                      }}
                      className="pointer-events-auto mt-[26px] h-auto w-[72px] shrink-0 cursor-pointer sm:w-[88px]"
                      style={{
                        // A full turn while spinning; 356deg ≡ -4deg, so with the
                        // transition off the snap back to rest is invisible.
                        transition: spinning
                          ? "transform 0.9s cubic-bezier(0.34,1.2,0.4,1)"
                          : "none",
                        transform: `rotate(${spinning ? 356 : -4}deg)`,
                      }}
                    />
                    <span className="relative inline-block max-w-[190px] -rotate-2 font-hand text-base text-char-muted sm:max-w-[220px] sm:text-[17px]">
                      <span
                        className="inline-block transition-opacity duration-250"
                        style={{ opacity: spinning ? 0 : 1 }}
                      >
                        stardust hopes you enjoy your stay in this site!
                      </span>
                      <span
                        className="absolute top-0 left-0 text-lg whitespace-nowrap transition-opacity duration-250"
                        style={{ opacity: spinning ? 1 : 0 }}
                      >
                        weeeee!
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </header>
            <div
              className="flex flex-wrap items-end justify-center gap-8 lg:hidden"
              aria-label="Photo gallery"
            >
              {pinned.map(({ photo, index }) => (
                <PolaroidPhoto
                  key={photo.caption}
                  photo={{ ...photo, inline: true }}
                  open={embeddedPhotos && inspected === index}
                  onOpenChange={(open) => setInspected(open ? index : null)}
                />
              ))}
            </div>
            <section ref={articles} id="articles">
              <div className="mb-2 flex flex-col items-start gap-1 border-b border-line-default pb-2 sm:flex-row sm:items-baseline sm:gap-3.5">
                <h2 className="font-display text-[30px] leading-none font-normal text-char-default sm:text-[32px]">
                  Articles
                </h2>
                <span className="text-sm text-char-faint">
                  software, math, random thoughts
                </span>
              </div>
              <div className="flex flex-col">
                {commonEn.articles.map((article: Article) => (
                  <ArticleCard key={article.title} {...article} />
                ))}
              </div>
            </section>
            <footer
              ref={contacts}
              id="contacts"
              className="flex flex-col items-start gap-4 border-t border-line-default pt-7 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-6"
            >
              <span className="font-display text-2xl text-char-default">
                Say hello
              </span>
              <div className="flex gap-5 text-sm">
                {commonEn.contacts.map(({ name, href }: Contact) => (
                  <a key={name} href={href}>
                    {name}
                  </a>
                ))}
              </div>
              <span className="text-xs text-char-faint sm:ml-auto">
                - luke taylor says hi
              </span>
            </footer>
          </main>
        </div>
      </div>
      <ProjectDeck projects={commonEn.projects} />
    </div>
  );
}
