import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types";
import jwt from "jsonwebtoken";
import { env } from "process";
import { isTokenValid } from "../utils/jwt";

const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken, env.JWT_SECRET_ACCESS_TOKEN!);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(accessToken, env.JWT_SECRET_REFRESH_TOKEN!);
  } catch (error) {}
};
