# 빌드 스테이지
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION} AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# 실행 스테이지
FROM node:${NODE_VERSION}
WORKDIR /app
COPY package*.json ./
RUN npm ci  
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/public ./public

ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npm run prisma:deploy && npm run start"]