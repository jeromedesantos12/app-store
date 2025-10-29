import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface UserPayload {
  id: string;
  username: string;
  role: string;
}

export function signToken(payload: UserPayload) {
  return sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return verify(token, JWT_SECRET) as UserPayload;
}
