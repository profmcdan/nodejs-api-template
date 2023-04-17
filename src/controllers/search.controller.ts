import { type IHttpResponse } from '../interfaces';
import elasticClient from '../elastic';
import { type ICreatePost } from '../interfaces/search.interface';
import { Route, Tags, Controller, Body, Post, SuccessResponse, Path, Delete, Get } from 'tsoa';

@Route('api/v1/search')
@Tags('Search')
export default class SearchController extends Controller {
  @Post('posts')
  @SuccessResponse('201', 'Created')
  public async createPost(@Body() post: ICreatePost): Promise<IHttpResponse> {
    const result = await elasticClient.index({
      index: 'posts',
      document: post,
    });
    return {
      status: 201,
      message: 'Success',
      data: result,
    };
  }

  @Delete('/posts/{id}')
  public async deletePost(@Path() id: string): Promise<IHttpResponse> {
    const result = await elasticClient.delete({
      index: 'posts',
      id,
    });
    return {
      status: 201,
      message: 'Success',
      data: result,
    };
  }

  @Get('/posts')
  public async getPosts(): Promise<IHttpResponse> {
    const result = await elasticClient.search({
      index: 'posts',
      query: { match_all: {} },
    });
    return {
      status: 201,
      message: 'Success',
      data: result,
    };
  }

  @Get('/posts/{query}')
  public async searchPosts(@Path() query: string): Promise<IHttpResponse> {
    const result = await elasticClient.search({
      index: 'posts',
      query: { fuzzy: { title: query } },
    });
    return {
      status: 201,
      message: 'Success',
      data: result,
    };
  }
}
