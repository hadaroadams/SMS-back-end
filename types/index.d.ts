import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

interface TokenUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface CreateJWT {
  tokenUser: TokenUser;
  refreshToken;
}

interface AttachCookiesTpResponse {
  res: Response;
  tokenUser: TokenUser;
  refreshToken: string;
}

interface CustomRequest extends Request {
  user?: TokenUser;
}

interface Payload extends JwtPayload {
  user: TokenUser;
  refreshToken?: string;
  accessTokenToken?: string;
}
