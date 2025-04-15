// 클라이언트에서 1번 영상에 좋아요를 눌러서 서버로 API 요청을 보냄
const response = await fetch("https://api.youtube.com/1/like", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});
const body = await response.json();
