import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";

const { ENV_SECRET_KEY } = process.env;

const SECRET_KEY = ENV_SECRET_KEY;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw HttpError(401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(decoded.id);

    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
