import { type PaginateFunction } from 'prisma-pagination';
import { type Language, type User } from '../custom';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export type Request = {
      language?: Language;
      user?: User;
      paginate?: PaginateFunction;
    };
  }
}
