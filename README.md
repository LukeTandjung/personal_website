# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Article compilation

Typst articles are compiled with the versions pinned by `flake.nix`:

- Typst 0.15.1
- Calepin 0.0.57

Enter the development shell and compile the articles:

```bash
nix develop
bun run articles:compile
```

The compiler reads article indexes 0–3 from
`~/Documents/vault/personal_articles` and article 4's publication entrypoints
from `~/Documents/vault/project_draft/simplex_trees/web`. Override these with
`ARTICLE_SOURCE_ROOT` and `SIMPLEX_ARTICLE_PARTS_ROOT` respectively.

`app/app.css` is the article design source of truth. The
`--article-*`, font, and colour tokens are converted into the paged Typst theme
at `scripts/generated/article-theme.typ`. Do not edit that generated file;
regenerate or verify it with:

```bash
bun run articles:theme
bun run articles:theme:check
```

All published article parts are compiled directly through Calepin. Article 4
diagrams exist only under `public/assets/articles/simplex_trees`; the theme
generator updates their semantic foreground attributes from `app/app.css` in place.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
