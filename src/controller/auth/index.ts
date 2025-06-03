import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import User from "../../models/User";
import config from '../../config';
import { jwtHelpers } from '../../utils/jwtHelper';

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

const sendError = (res: Response, status: number, message: string) =>
  res.status(status).json({ message });

export const Signup = async (req: Request, res: Response) => {
  try {
    const { username, password, shops } = req.body;

    if (!passwordRegex.test(password)) {
      return sendError(
        res,
        400,
        "Password must be at least 8 characters long and include at least one number and one special character."
      );
    }

    if (!Array.isArray(shops) || shops.length < 3) {
      return sendError(res, 400, "At least 3 shop names are required.");
    }

    // Normalize shop names to lowercase for case-insensitive uniqueness
    const normalizedShops = shops.map((name: string) => name.trim().toLowerCase());

    // Check for duplicate shop names across all users
    const existingShops = await User.find({ shops: { $in: normalizedShops } });
    if (existingShops.length > 0) {
      const takenShopNames = existingShops
        .flatMap(user => user?.shops)
        .filter(shop => normalizedShops?.includes(shop.toLowerCase()));

      return sendError(
        res,
        400,
        `These shop names are already taken: ${[...new Set(takenShopNames)].join(", ")}`
      );
    }

    // Check for duplicate shop names in the input itself
    const duplicates = normalizedShops.filter(
      (item, index) => normalizedShops.indexOf(item) !== index
    );
    if (duplicates.length > 0) {
      return sendError(
        res,
        400,
        `Duplicate shop names provided: ${[...new Set(duplicates)].join(", ")}`
      );
    }

    if (await User.findOne({ username })) {
      return sendError(res, 400, "Username is already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      shops: normalizedShops,
    });

    return res.status(201).json({
      message: "User created successfully.",
      data: {
        id: newUser._id,
        username: newUser.username,
        shops: newUser.shops,
      },
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return sendError(res, 500, "Something went wrong. Please try again.");
  }
};

export const Signin = async (req: Request, res: Response) => {
  try {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
      return sendError(res, 400, "Username and password required");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return sendError(res, 400, "User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, 400, "Incorrect password");
    }

    const expiresIn = rememberMe ? "7d" : "30m";

    const token = jwtHelpers.generateToken(
      { id: user._id, username: user.username },
       config.jwtSecret,
       expiresIn 
      )


    // Set token in cookie
     res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : '.localhost',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User signed in successfully",
      token
    });
  } catch (error) {
    console.error("Signin error:", error);
    return sendError(res, 500, "Server error");
  }
};

const Logout = async(req:Request,res:Response)=>{
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out" });
};

export const authController = {
  Signin,
  Signup,
  Logout
};
