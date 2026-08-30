import * as React from "react";

export type Tone = "info" | "success" | "warning" | "danger";

export interface Section {
  name: "about" | "articles" | "contacts";
}

export interface Tool {
  name: "back" | "next" | "menu";
  Icon: React.ElementType;
}

export interface Contact {
  name: string;
  href: string;
}

export interface PhotoPosition {
  top?: string | undefined;
  left?: string | undefined;
  right?: string | undefined;
}

export interface Photo {
  src: string;
  caption: string;
  width: number;
  rotate: number;
  inline?: boolean | undefined;
  position?: PhotoPosition | undefined;
}

export interface Project {
  name: string;
  status: "in progress" | "live" | "discontinued";
  image_url?: string | undefined;
  description: string;
  project_url?: string | undefined;
}

export interface Article {
  title: string;
  description: string;
  meta_data: string;
  article_index?: number | undefined;
  parts: Array<number>;
}

export interface Common {
  nav: Array<Section>;
  tool: Array<Tool>;
  contacts: Array<Contact>;
  introduction: Array<string>;
  interests: Array<string>;
  books: Array<string>;
  projects: Array<Project>;
  photos: Array<Photo>;
  articles: Array<Article>;
}
