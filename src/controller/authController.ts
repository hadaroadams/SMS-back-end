import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/dbConnect";
import { BadRequest, NotFound, Unauthenticated } from "../errors";
import jwt from "jsonwebtoken";
import { env } from "process";
import bcrypt from "bcryptjs";
import { createTokenUser } from "../utils/createTokenUser";
import { attachCookiesToResponse } from "../utils/jwt";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../../types";
const crypto = require("crypto");

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const emailAlreadyExist = await prisma.user.findUnique({
      where: { email },
    });
    if (emailAlreadyExist) throw next(new BadRequest("Email already Exists"));

    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    const refreshToken = crypto.randomBytes(40).toString("hex");

    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({ refreshToken, res, tokenUser });
    const userAgent = req.headers["user-agent"]!;
    const ip = req.ip!;

    await prisma.token.create({
      data: { ip, refreshToken, userAgent, userId: user.id },
    });

    res.status(200).json({ tokenUser });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new BadRequest("Email and password must be provided"));

    const user = await prisma.user.findUnique({ where: { email } })!;
    if (!user) next(new NotFound("No use with such email"));

    const isPasswordCorrect = await bcrypt.compare(password, user?.password!);

    if (!isPasswordCorrect) next(new Unauthenticated("Wrong password"));

    const tokenUser = createTokenUser(user!);

    let refreshToken = "";
    const existingToken = await prisma.token.findUnique({
      where: { userId: user?.id },
    });

    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) next(new Unauthenticated("Invalid Credientials"));
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ refreshToken, res, tokenUser });
      res.status(StatusCodes.OK).json({ user: tokenUser });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");

    const userAgent = req.headers["user-agent"]!;
    console.log(req.header);
    const ip = req.ip!;

    await prisma.token.create({
      data: {
        ip,
        refreshToken,
        userAgent,
        userId: user?.id!,
      },
    });

    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  await prisma.token.delete({ where: { userId: req.user?.id } });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user is logged out" });
};
