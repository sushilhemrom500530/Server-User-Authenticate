import { Response, NextFunction } from "express";
import { jwtHelpers } from "../utils/jwtHelper";
import config from "../config";
import { AuthenticatedRequest } from "../interface/AuthenticatedRequest";

export const verifyUserToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token: string = req?.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  try {
    const decoded = jwtHelpers.verifyToken(token, config.jwtSecret as string);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
