import express, { Request, Response, NextFunction, Application } from "express";
import { config } from "dotenv";
config();
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import { env } from "process";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConnect";
import rateLimit from "express-rate-limit";
import authRoute from "./route/authRoute";
import studentRoute from "./route/studentRoute";
import { notFound } from "./middleware/notFound";
import errorHandleMiddleware from "./middleware/error-handler";

const PORT = Number(env.PORT);
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(cookieParser(env.JWT_SECRET_TOKEN));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//   })
// );

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/students", studentRoute);

app.use(notFound);
app.use(errorHandleMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
