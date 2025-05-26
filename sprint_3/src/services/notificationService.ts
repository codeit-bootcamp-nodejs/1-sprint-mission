import { Type } from "@prisma/client";
import NotFoundError from "../lib/error/NotFoundError";
import notificationRepository from "../repositories/notificationRepository";

const updateStatus = async (userId: number, id: number) => {
  const getData = await notificationRepository.getById(userId, id);

  if (!getData) {
    throw new NotFoundError("알림");
  } else if (getData.isRead === false) {
    return await notificationRepository.update(userId, id);
  }
};

const create = async (userIds: number[] | number, type: Type) => {
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  const tasks = ids.map((userId) => {
    const content =
      type === "PRICE"
        ? "관심을 표시한 상품의 가격이 변동되었습니다!"
        : "작성한 게시글에 댓글이 달렸습니다!";
    return notificationRepository.save(userId, type, content);
  });

  return await Promise.all(tasks);
};
export default { updateStatus, create };
