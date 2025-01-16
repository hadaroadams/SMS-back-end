import { NextFunction, Response } from "express";
import { CustomRequest, Role, TokenUser } from "../../types";
import { env } from "process";
import { attachCookiesToResponse, isTokenValid } from "../utils/jwt";
import { prisma } from "../config/dbConnect";
import { Unauthenticated, Unauthorized } from "../errors";

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies;
  //   console.log(refreshToken, accessToken);
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken, env.JWT_SECRET_ACCESS_TOKEN!);
      //   console.log(payload);
      req.user = payload;
      return next();
    }

    const payload = isTokenValid(accessToken, env.JWT_SECRET_REFRESH_TOKEN!);
    const existingToken = await prisma.token.findUnique({
      where: { userId: payload.id },
    });

    if (!existingToken || !existingToken?.isValid) {
      return next(new Unauthenticated("Authention Invalid"));
    }
    attachCookiesToResponse({
      res,
      refreshToken: existingToken.refreshToken,
      tokenUser: payload,
    });
    req.user = payload;
  } catch (error) {
    console.log(error);
    return next(new Unauthenticated("Authention Invalid"));
  }
};

const authorizePermissions = (...roles: Role[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!roles.includes(req.user?.role!)) {
      throw new Unauthorized("Unauthorized to access this Route");
    }
    next();
  };
};
