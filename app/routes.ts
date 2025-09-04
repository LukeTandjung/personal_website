import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("articles/:index/part/:part", "routes/articles.tsx"),
] satisfies RouteConfig;
