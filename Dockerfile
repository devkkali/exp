FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

ENV NODE_ENV=production

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
