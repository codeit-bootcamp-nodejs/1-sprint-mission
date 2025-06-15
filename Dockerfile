# 1. 베이스 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 설치
COPY package*.json ./
RUN npm ci

# 4. 소스 코드 복사
COPY . .

# 5. TypeScript 빌드
RUN npm run build

# 6. 런타임 명령 설정
CMD ["node", "build/main.js"]
