import jwt from "jsonwebtoken";
import {JWT_SECRET_ENV} from "../../models/Constants";

const JWT_SECRET = process.env[JWT_SECRET_ENV] || 'supersecrettoken';
const JWT_EXPIRATION = '1h'; // Token läuft in einer Stunde ab

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('JWT-Fehler:', err);
    return null;
  }
}

export function signJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
}
