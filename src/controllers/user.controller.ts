import prisma from '../config/databases';
import { type Request, type Response } from 'express';
import { comparePassword, createJwt, hashPassword } from '../modules/auth.module';

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.send({ success: true, data: { users } });
};

export const getOneUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.send({ success: true, data: { user } });
};

export const updateUser = async (req: Request, res: Response) => {
  const updated = await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
      photo: req.body.photo,
    },
  });
  // delete updated.password;
  res.send({ success: true, data: { user: updated } });
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });

  // delete deleted.password;
  res.send({ success: true, data: { user: deleted } });
};

export const registerUser = async (req: Request, res: Response) => {
  const hashedPassword = await hashPassword(req.body.password);
  const user = await prisma.user.create({
    data: {
      email: req.body.email.toLowerCase().trim(),
      name: req.body.name,
      password: hashedPassword,
    },
  });
  // const today = new Date();

  // const token = await prisma.token.create({
  //   data: {
  //     userId: user.id,
  //     value: generateRandomString(128),
  //     expiry: new Date(today.setDate(new Date().getDate() + 7)),
  //     category: 'SIGNUP',
  //   },
  // });

  // TODO: Send email to set password.

  res.status(201).json({ success: true, data: { user } });
};

export const signIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email.toLowerCase().trim(),
    },
  });

  if (user !== null) {
    const isValid = await comparePassword(req.body.password, user.password);
    if (isValid) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      res.send({ success: true, data: { accessToken: createJwt(user) } });
      return;
    }
  }

  res.status(401).send({ success: true, detail: 'Invalid username or password' });
};

export const getLoggedInUser = async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  // delete user.password;
  res.send({ success: true, data: { user } });
};
