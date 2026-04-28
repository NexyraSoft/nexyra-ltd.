import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { env } from "../config/env";
import { User, userRoles } from "../models/User";
import { signToken } from "../utils/jwt";

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const AUTH_COOKIE_NAME = "nexyrasoft_session";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });
};

const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });
};

export const signup = async (req: Request, res: Response) => {
  return res.status(403).json({ message: "Public signup is disabled. Admin access is required to create users." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user);
  setAuthCookie(res, token);

  return res.json({
    message: "Logged in successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const me = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  const samePassword = await bcrypt.compare(newPassword, user.password);
  if (samePassword) {
    return res.status(400).json({ message: "New password must be different from the current password." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  clearAuthCookie(res);
  return res.json({ message: "Password updated successfully." });
};

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res);

  return res.json({ message: "Logged out successfully." });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required." });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  if (!userRoles.includes(role as (typeof userRoles)[number])) {
    return res.status(400).json({ message: "Please provide a valid role." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return res.status(201).json({
    message: "User created successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res.json(
    users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })),
  );
};

export const deleteUser = async (req: Request, res: Response) => {
  if (req.user?.id === req.params.id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ message: "User removed successfully." });
};
