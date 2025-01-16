import jwt from "jsonwebtoken";
import { env } from "process";
import { AttachCookiesTpResponse, Payload, TokenUser } from "../../types";
// const createJWT = ({ tokenUser }: CreateJWT) => {
//   return jwt.sign(tokenUser, env.JWT_SECRET_ACCESS_TOKEN!);
// };

export const isTokenValid = (
  token: string,
  jwTsecretToken: string
): TokenUser => jwt.verify(token, jwTsecretToken) as TokenUser;

export const attachCookiesToResponse = ({
  res,
  refreshToken,
  tokenUser,
}: AttachCookiesTpResponse) => {
  const accessTokenJWT = jwt.sign(tokenUser, env.JWT_SECRET_ACCESS_TOKEN!);
  const refreshTokenJWT = jwt.sign(
    { ...tokenUser, refreshToken },
    env.JWT_SECRET_REFERESH_TOKEN!
  );

  const oneDay = 24 * 60 * 60 * 1000;
  const longerExp = 30 * 24 * 60 * 60 * 1000;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};
