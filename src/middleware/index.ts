import { type NextFunction, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
// import { createPaginator } from 'prisma-pagination';

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

// export const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   req.paginate = createPaginator({ page: Number(req.query.page), perPage: 10 });
//   next();
// };
