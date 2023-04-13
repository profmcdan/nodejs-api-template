import { Router } from 'express';
import { protectRoute } from '../modules/auth.module';
import { loginValidator, registerUserValidator, updateUserValidator } from '../validators/user.validator';
import { deleteUser, getLoggedInUser, getOneUser, getUsers, registerUser, signIn, updateUser } from '../controllers/user.controller';
import { inputValidationMiddleware } from '../middleware';

const userRouter = Router();

userRouter.post('/login', loginValidator, inputValidationMiddleware, signIn);

userRouter.post('/register', registerUserValidator, inputValidationMiddleware, registerUser);

userRouter.get('/me', protectRoute, getLoggedInUser);

userRouter.get('/', getUsers);

userRouter.get('/:id', protectRoute, getOneUser);

userRouter.put('/:id', protectRoute, updateUserValidator, inputValidationMiddleware, updateUser);

userRouter.delete('/:id', protectRoute, deleteUser);

export default userRouter;
