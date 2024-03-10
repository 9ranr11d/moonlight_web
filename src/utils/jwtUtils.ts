import jwt from "jsonwebtoken";

/** JWT Secret key */
const secret: string = process.env.JWT_SECRET!;

/** Access Token 발급 */
export const sign = (userId: string) => {
  return jwt.sign({ id: userId }, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

/** Access Token 검증 */
export const verify = (token: string) => {
  let decoded: any = null;

  try {
    decoded = jwt.verify(token, secret);

    return {
      ok: true,
      userId: decoded.id,
    };
  } catch (err: any) {
    return {
      ok: false,
      msg: err.message,
    };
  }
};

/** Refresh Token 발급 */
export const refresh = (userId: string) => {
  return jwt.sign({ id: userId }, secret, {
    algorithm: "HS256",
    expiresIn: "14d",
  });
};

/** Refresh Token 검증 */
export const refreshVerify = (token: string) => {
  try {
    jwt.verify(token, secret);

    return true;
  } catch (err: any) {
    return false;
  }
};
