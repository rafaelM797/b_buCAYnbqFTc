# ============ ETAPA 1: CONSTRUCCIÓN ============
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

# ============ ETAPA 2: PRODUCCIÓN ============
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install --prod --frozen-lockfile 2>/dev/null || pnpm install --prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]
