# Panda Market API

## 환경 변수 설정

`.env.example` 파일을 참고해서 `.env`와 `.env.test`에 필요한 환경 변수를 설정해 주세요.

## 설치

의존성 패키지를 설치합니다.

```
npm install
```

Prisma와 데이터베이스를 준비합니다.

```
npx prisma generate
npx prisma migrate dev
```

## 실행

`npm dev`로 개발 모드로 실행할 수 있습니다.

## 테스트 관련 설명

### 테스트 실행

`npm test`로 테스트를 실행할 수 있습니다.

(해당 명령어에서 `.env.test`에 명시된 데이터베이스에 `prisma migrate`를 실행합니다.)

### 테스트 파일의 위치

테스트 파일은 소스 코드 파일과 동일한 폴더에 있습니다.

- 상품 API 통합 테스트: `src/routers/productsRouter.test.ts`
- 게시글 API 통합 테스트: `src/routers/articlesRouter.test.ts`
- 인증 API 통합 테스트: `src/routers/authRouter.test.ts`
- 상품 API 비즈니스 로직 유닛 테스트: `src/routers/productsService.test.ts`
- 게시글 API 비즈니스 로직 유닛 테스트: `src/routers/articlesService.test.ts`

### tsconfig.json 설정

테스트 파일은 빌드에서 제외해야하기 때문에 `exclude`로 지정해 주었습니다.

```json
"include": [
  "src/**/*.ts"
],
"exclude": [
  "src/**/*.test.ts"
]
```

### 미션 목표

Jest와 Supertest를 사용해 유닛 테스트, 통합 테스트 작성하기

## 요구사항

### 기본 요구사항

Jest의 테스트 커버리지 도구를 사용하도록 설정해 주세요.
인증이 필요하지 않은 상품 API에 대한 통합 테스트를 작성해 주세요.
인증이 필요하지 않은 게시글 API에 대한 통합 테스트를 작성해 주세요.
로그인, 회원가입 API에 대한 통합 테스트를 작성해 주세요.
인증이 필요한 상품 API에 대해 통합 테스트를 작성해 주세요.
인증이 필요한 게시글 API에 대해 통합 테스트를 작성해 주세요.

### 심화 요구사항

상품 API의 비즈니스 로직에 대해 Mock, Spy를 활용해 유닛 테스트를 작성해 주세요.
