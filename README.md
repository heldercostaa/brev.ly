<p align="center">
  <img alt="Brev.ly" src=".github/logo.svg" width="160">
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-layout">Layout</a> •
  <a href="#-technologies">Technologies</a> •
  <a href="#-getting-started">Getting started</a>
</p>

<p align="center">
  <img alt="Brev.ly preview" src=".github/1. Landing page (Desktop).png" width="100%">
</p>

## ✨ About
Brev.ly is a simple URL shortener. It lets users create custom short links, access the original URL through them, track the number of visits, delete links, and export the registered links as a CSV file.

## 🔖 Layout

You can view the project layout accessing Figma:

- [Figma file](https://www.figma.com/design/tU1mg5ycgCph11GbqM8HHK/Encurtador-de-Links--Community-?m=auto&t=noSfFh3yzIwtW7lb-6)

## 🚀 Technologies

- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Fastify](https://fastify.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)

## 💻 Getting started

### Requirements

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) or a local PostgreSQL database

**Clone the project and access the folder**

```bash
git clone https://github.com/heldercostaa/brev.ly.git && cd brev.ly
```

### Server

```bash
# Access the server folder
cd server

# Install dependencies
pnpm install

# Create the environment file
# And fill it with YOUR valid values
cp .env.example .env

# Start PostgreSQL with Docker
docker compose up -d postgres

# Run database migrations
pnpm run db:migrate

# Start the API
pnpm run dev
```

### Web

**Make sure the server is running before starting the web app.**

```bash
# Access the web folder
cd web

# Install dependencies
pnpm install

# Create the environment file
# And adjust it with your backend information
cp .env.example .env

# Start the app
pnpm run dev
```
