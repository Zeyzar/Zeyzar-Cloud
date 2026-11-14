# ZEYZAR CLOUD

**A private, self-hosted control plane for Zeyzar infrastructure.**

ZEYZAR CLOUD is being built as an independent platform. It does not modify or depend on the ZeboAI repository or its Netlify deployment.

## Current milestone — 0.2.0

- Premium responsive cloud dashboard UI
- Private owner sign-in gate backed by a server-side session
- HttpOnly, SameSite=Strict session cookie; Secure by default
- Login rate limiting and constant-time credential comparisons
- Self-hosted Node.js server that serves the production frontend and API
- Dockerfile and Docker Compose starter for self-hosting
- No third-party hosting provider integration and no live deployment engine yet

## Stack

- React 18 + Vite 6
- Node.js 22 built-in HTTP server (no application runtime dependencies)
- Docker / Docker Compose

## Run locally

1. Install Node.js 22 or newer.
2. Copy `.env.example` to `.env`.
3. Set `OWNER_USERNAME` and a unique `OWNER_PASSWORD` of at least 12 characters.
4. For local HTTP testing only, set `COOKIE_SECURE=false`.
5. Run:

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000`.

For frontend development, run `npm run dev` in another terminal. The Vite development server proxies `/api` to `http://localhost:3000`.

## Self-host with Docker

Copy `.env.example` to `.env`, set strong owner credentials, then run:

```bash
docker compose up -d --build
```

The app listens on port 3000 by default. Put it behind a trusted HTTPS reverse proxy before exposing it to the internet. Keep `COOKIE_SECURE=true` for HTTPS deployments. Never commit `.env`.

## Security notes

- There is no default owner account or hard-coded password.
- Configure a long, unique owner password before use.
- Session cookies are HttpOnly and SameSite=Strict; HTTPS is expected in production.
- Login attempts are rate-limited in process memory.
- Sessions are currently in memory and are invalidated when the server restarts.
- This initial milestone is a private dashboard foundation, not yet a hardened multi-user identity system.
- Do not expose the service directly to the public internet without HTTPS, firewall rules, backups, and operational monitoring.

## Roadmap

1. **Private self-hosted foundation** — owner access, server, container packaging (current)
2. **Persistent control plane** — database-backed projects, settings, sessions, audit events
3. **GitHub connection** — least-privilege repository access and secure webhook verification
4. **Build workers** — isolated, resource-limited builds for untrusted repository code
5. **Static hosting engine** — artifact storage, routing, deploy history, rollback
6. **Domains and TLS** — custom domains and automated certificates
7. **Application runtimes** — isolated containers for supported backend workloads
8. **Operations** — logs, metrics, quotas, backup and recovery

ZEYZAR CLOUD is developed separately from ZeboAI.
