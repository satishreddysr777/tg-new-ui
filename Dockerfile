# syntax=docker/dockerfile:1

# ── 1. install deps ─────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── 2. build (API_ORIGIN is baked into next.config rewrites here) ───────────
FROM deps AS build
ARG API_ORIGIN
ARG JWT_SECRET
ARG SESSION_COOKIE_NAME=tg_session
ENV API_ORIGIN=$API_ORIGIN \
    JWT_SECRET=$JWT_SECRET \
    SESSION_COOKIE_NAME=$SESSION_COOKIE_NAME \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

# ── 3. runtime: standalone server only ──────────────────────────────────────
FROM node:20-alpine AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
