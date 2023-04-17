import { Router, type Request, type Response } from 'express';
import { protectRoute } from '../modules/auth.module';
import { createPostValidator } from '../validators/user.validator';
import { inputValidationMiddleware } from '../middleware';
import SearchController from '../controllers/search.controller';

const searchRouter = Router();

searchRouter.get('/posts', async (req: Request, res: Response) => {
  const searchController = new SearchController();
  const response = await searchController.getPosts();
  return res.send(response);
});

searchRouter.get('/posts/:query', async (req: Request, res: Response) => {
  const searchController = new SearchController();
  const response = await searchController.searchPosts(req.params.query);
  return res.send(response);
});

searchRouter.post('/posts', createPostValidator, inputValidationMiddleware, async (req: Request, res: Response) => {
  const searchController = new SearchController();
  const response = await searchController.createPost(req.body);
  return res.send(response);
});

searchRouter.delete('/posts/:id', protectRoute, async (req: Request, res: Response) => {
  const searchController = new SearchController();
  const response = await searchController.deletePost(req.params.id);
  return res.send(response);
});

export default searchRouter;
