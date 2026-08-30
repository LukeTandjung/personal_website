import { type Common } from "types";
import { ArrowLeftIcon, ArrowRightIcon, MenuIcon } from "components";

export const commonEn: Common = {
  nav: [{ name: "about" }, { name: "articles" }, { name: "contacts" }],
  tool: [
    { name: "back", Icon: ArrowLeftIcon },
    { name: "next", Icon: ArrowRightIcon },
    { name: "menu", Icon: MenuIcon },
  ],
  contacts: [
    {
      name: "github",
      href: "https://github.com/LukeTandjung",
    },
    {
      name: "email",
      href: "mailto:lukelucus123@gmail.com",
    },
  ],
  introduction: [
    `I design mathematical and statistical software systems.`,
    `When I am not coding, I am learning more about Computer Science, or
    writing about anything that comes into my mind.`,
  ],
  interests: [
    "Rust, Nix, EffectTS",
    "Distributed Systems",
    "Computer Architecture",
  ],
  books: [
    "A Philosophy of Software Design — John Ousterhout",
    "Designing Data-Intensive Applications, 2nd ed. — Martin Kleppmann",
  ],
  projects: [
    {
      name: "Rstful",
      status: "live",
      image_url: "/assets/site/logos/rstful.png",
      description: "An agentic RSS reader — your antivirus from the internet.",
      project_url: "rstful.com",
    },
    {
      name: "Ariadne",
      status: "live",
      image_url: "/assets/site/logos/ariadne.png",
      description:
        "The agent SDK that threads your agents out of the labyrinth.",
      project_url: "github/ariadne",
    },
    {
      name: "Base GPUI",
      status: "in progress",
      image_url: "/assets/site/logos/base-gpui.png",
      description:
        "Base UI's headless component APIs, ported natively to GPUI.",
      project_url: "github/base-gpui",
    },
    {
      name: "Neosicht",
      status: "live",
      image_url: "/assets/site/logos/neosicht.png",
      description: "A themeable, GPUI-native desktop shell bar for macOS.",
      project_url: "brew install --cask neosicht",
    },
  ],
  photos: [
    {
      src: "/assets/site/photos/tokyo_2024.jpeg",
      caption: "tokyo, 2024",
      width: 210,
      rotate: 4,
      position: { top: "4%", right: "-180px" },
    },
    {
      src: "/assets/site/photos/jeju_2022.jpeg",
      caption: "jeju, 2022",
      width: 220,
      rotate: -5,
      position: { top: "21%", left: "-190px" },
    },
    {
      src: "/assets/site/photos/amsterdam_2025.jpeg",
      caption: "amsterdam, 2025",
      width: 200,
      rotate: 3,
      inline: true,
    },
    {
      src: "/assets/site/photos/hainan_2024.jpeg",
      caption: "hainan, 2024",
      width: 205,
      rotate: -3.5,
      position: { top: "66%", left: "-175px" },
    },
    {
      src: "/assets/site/photos/san_francisco_2026.jpeg",
      caption: "san francisco, 2026",
      width: 210,
      rotate: -2,
      inline: true,
    },
  ],
  articles: [
    {
      title:
        "From Blocks to Buttons: Minecraft Skeuomorphic Principles Applied to UI Design",
      description: `How Minecraft building principles translate into UI design
      principles, and a design system built from them.`,
      meta_data: "1/2 parts, 5 mins each",
      article_index: 0,
      parts: [0],
    },
    {
      title: "A somewhat accessible introduction to Zero Knowledge Proofs",
      description: `The inner workings of a ZKP, intuitive yet rigorous,
      building up to writing a basic ZKP from scratch.`,
      meta_data: "1/n parts, 1 hour each",
      article_index: 1,
      parts: [0],
    },
    {
      title: "Your Learning Should Be As Irreverent As Possible",
      description: `Most people don't actually want to teach you, so you
      should stop following them.`,
      meta_data: "5 mins read",
      article_index: 2,
      parts: [0],
    },
    {
      title: "To Walk Out Of The Cave",
      description: `Musings on three weeks in San Francisco during the Break
      In program hosted by Dedalus Labs.`,
      meta_data: "10 mins read",
      article_index: 3,
      parts: [0],
    },
    {
      title:
        "Memory Has Many Faces: Simplicial Complexes as Agent Memory Layers",
      description: `Simplicial complexes, simplex trees, and database-backed
      agent memory layers.`,
      meta_data: "4/6 parts, 10 mins each",
      article_index: 4,
      parts: [0, 1, 2, 3],
    },
  ],
};
