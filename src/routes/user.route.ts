import { Router, type Request, type Response } from 'express';
import { protectRoute } from '../modules/auth.module';
import { loginValidator, registerUserValidator, updateUserValidator } from '../validators/user.validator';
import UserController from '../controllers/user.controller';
import { inputValidationMiddleware } from '../middleware';

const userRouter = Router();

userRouter.get('/', async (_req: Request, res: Response) => {
  const userController = new UserController();
  const response = await userController.getUsers();
  return res.send(response);
});

userRouter.get('/:id', protectRoute, async (req: Request, res: Response) => {
  const userController = new UserController();
  const response = await userController.getOneUser(req.params.id);
  if (response.data === null) {
    return res.status(404).json({ status: 404, detail: 'User with id not found' });
  }
  return res.send(response);
});

userRouter.put('/:id', protectRoute, updateUserValidator, inputValidationMiddleware, async (req: Request, res: Response) => {
  const userController = new UserController();
  const response = await userController.updateUser(req.params.id, req.body);
  return res.send(response);
});

userRouter.delete('/:id', protectRoute, async (req: Request, res: Response) => {
  const userController = new UserController();
  const response = await userController.deleteUser(req.params.id);
  return res.send(response);
});

userRouter.get('/me', protectRoute, async (req: any, res: Response) => {
  const userController = new UserController();
  const response = await userController.getOneUser(req.user.id);
  return res.send(response);
});

userRouter.post('/register', registerUserValidator, inputValidationMiddleware, async (req: any, res: Response) => {
  const userController = new UserController();
  const response = await userController.registerUser(req.body);
  return res.send(response);
});

userRouter.post('/login', loginValidator, inputValidationMiddleware, async (req: any, res: Response) => {
  const userController = new UserController();
  const response = await userController.signIn(req.body);
  return res.send(response);
});

export default userRouter;
