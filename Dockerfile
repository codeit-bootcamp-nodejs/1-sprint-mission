# 베이스 이미지
ARG NODE_VERSION
FROM node:${NODE_VERSION} 
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV PORT=3000
ENV BASE_URL=http://localhost:3000
ENV PUBLIC_PATH=/app/public
ENV STATIC_PATH=/public

VOLUME /app/public
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate dev && npm start"]
