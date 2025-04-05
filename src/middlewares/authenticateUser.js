import userRepository from "../repositories/userRepository.js";
import userService from "../services/userService.js";
import bcrypt from "bcrypt";
export const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ message: "The password does not match" });
      const error = new Error("The password does not match");
      error.code = 403;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
};
