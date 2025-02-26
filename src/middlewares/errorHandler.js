export function errorHandler(err, req, res, next) {
  console.error("🚨 에러 발생:", err);

  // 📌 유효성 검사 에러 (`express-validator`에서 발생)
  if (err.array) {
    return res.status(400).json({
      error: "유효성 검사 실패",
      details: err.array(),
    });
  }

  // 📌 Prisma 관련 에러
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      error: `Prisma 오류 (코드: ${err.code})`,
      details: err.message,
    });
  }

  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      error: "잘못된 데이터 입력입니다.",
      details: err.message,
    });
  }

  // 📌 기타 서버 오류 (디버깅을 위해 stack 정보도 출력)
  res.status(500).json({
    error: "서버 내부 오류가 발생했습니다.",
    details: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // 🔥 개발 환경에서만 stack 출력
  });

  // 다음 미들웨어로 에러 전달
  next(err);
}
