import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('email is required'),
  body('password').isString().withMessage('password is required'),
];

export const registerUserValidator = [
  body('name').isString().withMessage('name is required'),
  body('email').isEmail().withMessage('email is required'),
  body('password').isString().withMessage('password is required'),
  body('photo').optional().isString(),
  body('role').optional().isIn(['user', 'admin']).isString(),
];

export const updateUserValidator = [
  body('name').optional().isString().withMessage('name is required'),
  body('photo').optional().isString().withMessage('photo is required'),
];
