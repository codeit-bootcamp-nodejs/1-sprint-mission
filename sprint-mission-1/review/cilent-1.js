// 클라이언트에서 유튜브 서버로 영상을 업로드한다고 가정

const response = await fetch("https://api.youtube.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    author: "Sinrok Kim",
    title: "Node.js 1",
    description: "Node.js Bootcamp 1",
  }),
});
const body = await response.json();
