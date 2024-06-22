import jwt from "jsonwebtoken";

/** JWT Secret key */
const secret: string = process.env.JWT_SECRET!;

/**
 * Access Token 발급
 * @param userIdentification Identification
 * @returns Access Token
 */
export const sign = (userIdentification: string) => {
  return jwt.sign({ identification: userIdentification }, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

/**
 * Access Token 검증
 * @param token Access Token
 * @returns 유효한 Token인지
 */
export const verify = (token: string) => {
  let decoded: any = null;

  try {
    decoded = jwt.verify(token, secret);

    return {
      ok: true,
      userIdentification: decoded.identification,
    };
  } catch (err: any) {
    return {
      ok: false,
      msg: err.message,
    };
  }
};

/**
 * Refresh Token 발급
 * @param userIdentification Identification
 * @returns Refresh Token
 */
export const refresh = (userIdentification: string) => {
  return jwt.sign({ identification: userIdentification }, secret, {
    algorithm: "HS256",
    expiresIn: "14d",
  });
};

/**
 * Refresh Token 검증
 * @param token Refresh Token
 * @returns 유효한 Token인지
 */
export const refreshVerify = (token: string) => {
  try {
    jwt.verify(token, secret);

    return true;
  } catch (err: any) {
    return false;
  }
};
