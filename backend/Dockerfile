FROM node:22.12-slim AS builder

WORKDIR /app
COPY . .
RUN npm install

RUN npx nx build backend

FROM node:22.12-slim

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist

WORKDIR /app/dist

RUN npm install
RUN npm install pino-pretty pg

CMD ["node", "main.js"]
