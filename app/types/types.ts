import * as React from "react";

export interface Section {
  name: "about" | "projects" | "articles";
}

export interface Contact {
  name: string;
  Icon: React.ElementType;
  href: string;
}

export interface Interest {
  name: string;
  Icon: React.ElementType;
}

export interface TechStack {
  "front-end": Array<string>;
  "back-end": Array<string>;
  infrastructure: Array<string>;
}

export interface Project {
  name: string;
  type: "open" | "close";
  status: "in progress" | "live" | "discontinued";
  image_url?: string | undefined;
  description: string;
  project_url?: string | undefined;
}

export interface Article {
  title: string;
  description: string;
  meta_data: string;
  article_url?: string | undefined;
}

export interface Common {
  nav: Array<Section>;
  contacts: Array<Contact>;
  introduction: Array<string>;
  interests: Array<Interest>;
  stack: TechStack;
  projects: Array<Project>;
  articles: Array<Article>;
}
