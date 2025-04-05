import { prismaClient } from "../prismaClient.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { userId } = req;
    const routeUserId = parseInt(req.params.id, 10);

    if (routeUserId !== userId) {
      return res.status(403).json({ message: "The token does not match" });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return next();
  } catch (err) {
    console.error(err);
  }
};
