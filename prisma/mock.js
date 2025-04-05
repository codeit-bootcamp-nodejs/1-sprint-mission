export const PRODUCTS = [
  {
    id: "fc0bae87-0904-406e-8957-b1e6a45f856c",
    name: "나이키 테크조그거팬츠",
    description:
      "나이키의 테크조그거팬츠입니다. 운동이나 일상 생활에서 편안하게 착용할 수 있으며, 스타일과 기능을 모두 갖추고 있습니다.",
    price: 75000,
    tags: "Fashion",
    createdAt: "2023-07-14T10:30:00Z",
    updatedAt: "2023-07-14T10:30:00Z",
  },
  {
    id: "22bfc66c-de25-438e-8956-43378594cde4",
    name: "Apple AirPods 프로",
    description:
      "Apple의 AirPods 프로는 탁월한 사운드 품질과 노이즈 캔슬링 기능을 갖춘 무선 이어폰입니다. 간편한 터치 컨트롤과 긴 배터리 수명을 제공합니다.",
    price: 320000,
    tags: "Electronics",
    createdAt: "2023-07-14T11:00:00Z",
    updatedAt: "2023-07-14T11:00:00Z",
  },
  {
    id: "bab8a1f7-4a71-496b-91eb-838d8dc9bf1d",
    name: "아이언맨 골프 클럽 세트",
    description:
      "아이언맨 디자인으로 유명한 골프 클럽 세트입니다. 고품질 소재와 최신 기술로 제작되어 정밀한 스윙과 멋진 샷을 도와줍니다.",
    price: 850000,
    tags: "Sports",
    createdAt: "2023-07-14T12:00:00Z",
    updatedAt: "2023-07-14T12:00:00Z",
  },
  {
    id: "5521558b-1ae7-4f01-852f-06f5fb0d9af5",
    name: "헤라 UV 미스트 선스틱 SPF50+ PA+++",
    description:
      "헤라의 UV 미스트 선스틱은 SPF50+ PA+++로 강력한 자외선 차단과 함께 피부 보습에 도움을 주는 제품입니다. 휴대하기 편리한 스틱 형태로 사용이 간편합니다.",
    price: 28000,
    tags: "Beauty",
    createdAt: "2023-07-14T17:30:00Z",
    updatedAt: "2023-07-14T17:30:00Z",
  },
  {
    id: "369e807f-8e10-427d-bb3d-5590483df411",
    name: "쿠진앤에이 오믈렛 팬",
    description:
      "쿠진앤에이의 오믈렛 팬은 오믈렛을 쉽고 빠르게 만들 수 있는 전용 팬입니다. 내열성이 뛰어나며 논스틱 처리로 편리한 사용과 청소가 가능합니다.",
    price: 25000,
    tags: "Kitchenware",
    createdAt: "2023-07-15T13:30:00Z",
    updatedAt: "2023-07-15T13:30:00Z",
  },
];

export const ARTICLES = [
  {
    id: "d106c18a-90f7-4df4-a075-fe68bbdae631",
    title: "AI의 발전으로 본 미래",
    content: "IT",
    createdAt: "2023-07-15T19:00:00Z",
    updatedAt: "2023-07-15T19:00:00Z",
  },
  {
    id: "87d7bc48-b9dc-4702-bacb-97c44fd68c6c",
    title: "사회 경제의 구조",
    content: "Economy",
    createdAt: "2023-07-15T20:00:00Z",
    updatedAt: "2023-07-15T20:00:00Z",
  },
  {
    id: "25b1549a-5435-44db-9c16-75a4b7ab8de5",
    title: "금쪽이들은 어떻게 달라졌을까",
    content: "Life",
    createdAt: "2023-07-16T09:30:00Z",
    updatedAt: "2023-07-16T09:30:00Z",
  },
  {
    id: "f4123e62-5b03-4b19-ac9b-6289a0b3d9ca",
    title: "미래의 나는 어떤 모습일까",
    content: "Development",
    createdAt: "2023-07-16T11:00:00Z",
    updatedAt: "2023-07-16T11:00:00Z",
  },
  {
    id: "f9ef1d3a-29a2-4f9b-aeca-3b7af0625837",
    title: "부동산의 전망에 대해 알아보자",
    content: "Invstment",
    createdAt: "2023-07-16T14:30:00Z",
    updatedAt: "2023-07-16T14:30:00Z",
  },
];

export const COMMENTS = [
  {
    content: "이것은 댓글 테스트 내용입니다.",
    createdAt: "2023-07-16T14:00:00Z",
    updatedAt: "2023-07-16T14:00:00Z",
    productId: "fc0bae87-0904-406e-8957-b1e6a45f856c",
    articleId: null,
  },
  {
    content: "바지가 좋아요.",
    createdAt: "2023-07-16T14:30:00Z",
    updatedAt: "2023-07-16T14:30:00Z",
    productId: "fc0bae87-0904-406e-8957-b1e6a45f856c",
    articleId: null,
  },
  {
    content: "소리가 잘나요.",
    createdAt: "2023-07-16T14:40:00Z",
    updatedAt: "2023-07-16T14:40:00Z",
    productId: "22bfc66c-de25-438e-8956-43378594cde4",
    articleId: null,
  },
  {
    content: "글 잘 읽었습니다.",
    createdAt: "2023-07-16T14:50:00Z",
    updatedAt: "2023-07-16T14:50:00Z",
    productId: null,
    articleId: "f4123e62-5b03-4b19-ac9b-6289a0b3d9ca",
  },
  {
    content: "다음 글도 기대하겠습니다.",
    createdAt: "2023-07-16T15:20:00Z",
    updatedAt: "2023-07-16T15:20:00Z",
    productId: null,
    articleId: "f4123e62-5b03-4b19-ac9b-6289a0b3d9ca",
  },
  {
    content: "어려운 내용을 잘 설명 하셨습니다.",
    createdAt: "2023-07-16T17:00:00Z",
    updatedAt: "2023-07-16T17:00:00Z",
    productId: null,
    articleId: "87d7bc48-b9dc-4702-bacb-97c44fd68c6c",
  },
];
