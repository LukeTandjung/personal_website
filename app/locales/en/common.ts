import { type Common } from "types";
import {
  CpuChipIcon,
  CircleStackIcon,
  LanguageIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
} from "@heroicons/react/16/solid";
import { GitHubLogoIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

export const commonEn: Common = {
  nav: [{ name: "about" }, { name: "projects" }, { name: "articles" }],
  tool: [
    { name: "back", Icon: ArrowLeftIcon },
    { name: "next", Icon: ArrowRightIcon },
    { name: "menu", Icon: Bars3Icon },
  ],
  contacts: [
    {
      name: "github",
      Icon: GitHubLogoIcon,
      href: "https://github.com/LukeTandjung",
    },
    {
      name: "email",
      Icon: EnvelopeClosedIcon,
      href: "mailto:lukelucus123@gmail.com",
    },
  ],
  introduction: [
    `I am a full-stack software and AI engineer. I am passionate about
    utilising applied mathematics and statistics to build scalable,
    user-friendly, and innovative applications that are pleasing to
    the eye. I usually work closely with startups and small-medium
    enterprises.`,
    `When I am not coding, I am tinkering on Figma, learning more about
    Computer Science, or writing about anything that comes into my
    mind.`,
  ],
  interests: [
    { name: "Large Language Models", Icon: LanguageIcon },
    { name: "Distributed Systems", Icon: CircleStackIcon },
    { name: "Computer Architecture", Icon: CpuChipIcon },
  ],
  stack: {
    "front-end": [
      "React",
      "Typescript",
      "TailwindCSS",
      "Bun",
      "BaseUI",
      "React Router",
      "Effect",
    ],
    "back-end": ["Python", "Rust", "C", "FastAPI", "Actix", "Tauri"],
    infrastructure: ["Postgres", "Docker", "Terraform", "AWS", "Nix"],
  },
  projects: [
    {
      name: "yrekic",
      type: "close",
      status: "in progress",
      description: `A LLM powered note taking software. Content can be
      extracted in an i3-like window tiling manager and synthesised into
      Object-Concept-Mappings (OCM) that is stored in an embedded database.
      This builds up a knowledge graph, allowing notes to be automatically
      created by querying the database.`,
    },
    {
      name: "p2v",
      type: "close",
      status: "in progress",
      description: `A method of adding persona vector modality into an LLM.`,
    },
    {
      name: "esportion",
      type: "close",
      status: "in progress",
      description: `An agentic platform that processes global trade data to reveal
      trade patterns, derived unit prices, and competitor activities for specific commodities.`,
    },
  ],
  articles: [
    {
      title:
        "From Blocks to Buttons: Minecraft Skeuomorphic Principles Applied to UI Design.",
      description: `In this multiple part article series, we examine how
      Minecraft building principles can be translated into UI design principles.
      We create a UI design system from these principles.`,
      meta_data: "1/2 parts done, 5 mins each",
      article_index: 0,
      parts: [0],
    },
    {
      title: "A somewhat accessible introduction to Zero Knowledge Proofs",
      description: `In this multiple part article series, we learn about the
      inner workings of a ZKP in an intuitive yet rigorous manner, eventually
      building up to writing an basic ZKP from scratch.`,
      meta_data: "1/n parts done, 1 hour each",
      article_index: 1,
      parts: [0],
    },
    {
      title: "Your Learning Should Be As Irreverent As Possible",
      description: `Most people don't actually want to teach you, so you should stop following them.`,
      meta_data: "5 mins read",
      article_index: 2,
      parts: [0],
    },
  ],
};
