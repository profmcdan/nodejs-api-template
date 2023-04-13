import { type NextFunction, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';

export const customMiddleware = (req: any, res: Response, next: NextFunction) => {
  req.requestTime = Date.now();
  next();
};

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    res.send({ success: false, errors: errors.array() });
  } else {
    next();
  }
};
