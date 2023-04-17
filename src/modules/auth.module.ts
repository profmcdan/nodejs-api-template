import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { appEnvs } from '../config';
import { type NextFunction, type Response } from 'express';

export const createJwt = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, appEnvs.jwtSecret, { expiresIn: '1d' });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 5);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const protectRoute = (req: any, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).send({ success: false, detail: 'Not Authorized' });
    return;
  }

  const [, token] = bearer.split(' ');
  if (!token) {
    res.status(401).send({ success: false, detail: 'Not Authorized' });
    return;
  }

  try {
    req.user = jwt.verify(token, appEnvs.jwtSecret);
    next();
  } catch (err: any) {
    res.status(401).send({ success: false, detail: 'Not Authorized', message: err.message });
  }
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomString = (length: number) => {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
