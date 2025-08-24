import { type Common } from "types";
import {
  CpuChipIcon,
  CircleStackIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
import { GitHubLogoIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

export const commonEn: Common = {
  nav: [{ name: "about" }, { name: "projects" }, { name: "articles" }],
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
    { name: "Large Language Models", Icon: CpuChipIcon },
    { name: "Distributed Systems", Icon: CircleStackIcon },
    { name: "Zero Knowledge Proofs", Icon: LockClosedIcon },
  ],
  stack: {
    "front-end": [
      "React",
      "Typescript",
      "TailwindCSS",
      "Bun",
      "BaseUI",
      "React Router",
      "Expo",
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
      name: "conzeal",
      type: "close",
      status: "in progress",
      description: `A Zero Knowledge Proof (ZKP) age verifier built in compliance with the UK’s
      Online Safety Act. It is slated to use passports as the means of age verification.`,
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
      title: "A somewhat accessible introduction to Zero Knowledge Proofs",
      description: `In this multiple part article series, we learn about the
      inner workings of a ZKP in an intuitive yet rigorous manner, eventually
      building up to writing an basic ZKP from scratch.`,
      meta_data: "In progress",
    },
  ],
};
