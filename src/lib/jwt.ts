import JWT from "jsonwebtoken";
type CreateTokenType = [
  data: Parameters<typeof JWT.sign>[0],
  options?: Parameters<typeof JWT.sign>[2],
  cb?: Parameters<typeof JWT.sign>[3]
];
export const createToken = (...[data, options, cb]: CreateTokenType) => {
  try {
    return JWT.sign(data, process.env.JWT_SECRET!, {
      expiresIn: undefined ,
      ...(options ?? {}),
    });
  } catch (error) {
    console.error(error);
  }
};
export const verifyToken = (token: string) => {
  try {
    return JWT.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error(error);
     // Let the middleware handle the error
    throw error;
  }
};
