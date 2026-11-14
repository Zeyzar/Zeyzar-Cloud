# ZEYZAR CLOUD

A hybrid deployment control plane for managing projects across GitHub and hosting providers.

## Product direction

ZEYZAR CLOUD brings project management, deployment visibility, domains, environment configuration, and AI-assisted debugging into one workspace. Actual builds and hosting are delegated to connected providers rather than running a new hosting fleet.

## Current stage — 0.1.0

- Premium responsive dashboard shell
- Project overview and project creation UI
- Illustrative sample project, status, and activity data
- Search projects by name, repository, or provider
- No provider credentials or deployment actions wired yet

## Stack

- React 18
- Vite 6
- Lucide icons
- Plain CSS

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Planned milestones

1. GitHub App / OAuth connection and repository import
2. Provider adapters (Cloudflare Pages, Netlify, Render)
3. Real deployment creation, status polling, and build logs
4. Domains, environment variables, and preview deployments
5. AI-assisted build diagnostics

## Security principles

- Never commit API keys, OAuth secrets, or provider tokens.
- Store credentials server-side and encrypt them at rest.
- Use least-privilege OAuth scopes and per-workspace authorization.
- Treat build logs and repository content as untrusted input.

ZEYZAR CLOUD is independent from the ZeboAI repository and deployment.
