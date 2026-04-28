import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserDocument } from "../models/User";

export const signToken = (user: UserDocument) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
