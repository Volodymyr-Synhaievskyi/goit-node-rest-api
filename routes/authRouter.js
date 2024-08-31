import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  verifyUser,
  resendVerificationEmail,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import multer from "multer";

const authRouter = express.Router();

const upload = multer({ dest: "temp/" });

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrentUser);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);
authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", resendVerificationEmail);

export default authRouter;
