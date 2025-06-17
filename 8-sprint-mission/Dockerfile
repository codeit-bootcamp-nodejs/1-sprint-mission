FROM node:20 AS build-stage
WORKDIR /build

COPY . .

RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM node:20
WORKDIR /app

COPY --from=build-stage /build/package*.json ./
RUN npm ci --omit=dev          

COPY --from=build-stage /build/prisma ./prisma     
COPY --from=build-stage /build/node_modules/.prisma ./node_modules/.prisma
COPY --from=build-stage /build/node_modules/@prisma ./node_modules/@prisma
COPY --from=build-stage /build/dist ./dist

ENV PORT=3000

ENTRYPOINT ["npm", "run", "start"]