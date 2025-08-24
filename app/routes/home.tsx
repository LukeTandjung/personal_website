import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Luke's personal website" },
    { name: "description", content: "Welcome to Luke's personal website!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
