import { NextFunction, Request, Response, Errback } from "express";
import { StatusCodes } from "http-status-codes";

interface MyErrors {
  message: string;
}

const errorHandleMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandleMiddleware;
