import { adminAuth } from "../firebase/admin";

export const verifyToken = async (token: string) => {
  try {
    return await adminAuth.verifyIdToken(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
