ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION}

ENV SERVE_PORT=3000

WORKDIR /app

COPY sprint_3/package.json sprint_3/package-lock.json ./
RUN npm ci

COPY sprint_3/ ./
RUN npx prisma generate
RUN npm run build

RUN mkdir -p public
VOLUME /public

ENTRYPOINT ["npm", "run", "start"]