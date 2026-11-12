FROM node:22-bookworm

WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Raised from the default after the OOM kills in September.
ENV NODE_OPTIONS=--max-old-space-size=1024

EXPOSE 3000
CMD ["node", "dist/main.js"]
