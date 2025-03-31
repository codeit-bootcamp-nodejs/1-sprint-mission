// 유튜브 서버

class Video {
  constructor(id, author, title, description, uploadDate, likeCount = 0) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.description = description;
    this.updateDate = uploadDate;
    this._likeCount = likeCount;
  }

  like() {
    this._likeCount += 1;
  }

  set likeCount(value) {
    throw new Error("like()를 호출해서 변경해주세요");
  }

  get likeCount() {
    return this._likeCount;
  }
}

// 서버에서 client-1으로부터 영상을 업로드 받는 요청을 처리
// URL, method, request body를 받아서 데이터를 처리할 것을 정의
const video1 = new Video(
  1,
  dataFromRequest.author,
  dataFromRequest.title,
  dataFromRequest.description,
  new Date()
);
console.log(video1);

// client-2에서 좋아요 요청을 받아서 처리
// 1번 비디오를 찾을 수 있음
video1.like();
console.log(video1);
// video1 객체 정보를 클라이언트에 응답으로 전달

// client에서 title을 변경할 수 있는 API를 정의
const newTitle = dataFromRequest.title;
video1.title = newTitle;
console.log(video1);
