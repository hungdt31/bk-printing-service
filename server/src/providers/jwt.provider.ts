import jwt from "jsonwebtoken";
const generateToken = async (
  payload: string | Buffer | object,
  secretSignature: string,
  tokenLife: string,
) => {
  try {
    return jwt.sign(payload, secretSignature, {
      expiresIn: tokenLife,
      algorithm: "HS256",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

const verifyToken = async (token: string, secretSignature: string) => {
  try {
    return jwt.verify(token, secretSignature);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
