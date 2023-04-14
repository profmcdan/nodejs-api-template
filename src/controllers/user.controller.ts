import { Get, Post, Put, Delete, Route, Tags, Body, Path, SuccessResponse, Controller, Security, Query } from 'tsoa';
import paginator from 'prisma-paginate';
import prisma from '../config/databases';
import { comparePassword, createJwt, hashPassword } from '../modules/auth.module';
import { type IPagedHttpResponse, type IHttpResponse } from '../interfaces';
import { type ICreateUser, type ILoginUser, type IUpdateUser } from '../interfaces/user.interface';
import { sendNewEmail } from '../queue/email.queue';

@Route('api/v1/users')
@Tags('Users')
export default class UserController extends Controller {
  @Get('/')
  public async getUsers(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() search?: string,
    @Query() sort?: string,
  ): Promise<IPagedHttpResponse> {
    const emailData = {
      from: '"Fred Foo 👻" <foo@example.com>',
      to: 'bar@example.com',
      subject: 'Hello ✔',
      text: 'Hello world?',
      html: '<b>Hello world? Whats the matter with you.</b>',
    };
    sendNewEmail(emailData);

    const paginate = paginator(prisma);
    const result = await paginate.user.paginate({ limit: Number(limit), page: Number(page), where: {} });

    console.log(page, limit, search, sort);
    // const result = await prisma.user.findMany();

    return {
      status: 200,
      message: 'Success',
      result,
    };
  }

  @Get('/:id')
  @Security('bearer')
  public async getOneUser(@Path() id: string): Promise<IHttpResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: 'Success',
      data: user,
    };
  }

  @Put('{id}')
  @Security('bearer')
  public async updateUser(@Path() id: string, @Body() payload: IUpdateUser): Promise<IHttpResponse> {
    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
        photo: payload.photo,
      },
    });

    return {
      status: 200,
      message: 'Success',
      data: updated,
    };
  }

  @Delete('/{id}')
  @Security('bearer', ['admin'])
  public async deleteUser(@Path() id: string): Promise<IHttpResponse> {
    const deleted = await prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: 'Success',
      data: deleted,
    };
  }

  @Post('register')
  @SuccessResponse('201', 'Created')
  public async registerUser(@Body() payload: ICreateUser): Promise<IHttpResponse> {
    const hashedPassword = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: {
        email: payload.email.toLowerCase().trim(),
        name: payload.name,
        password: hashedPassword,
      },
    });

    // const job = await addJobToQueue(user);

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

    return {
      status: 201,
      message: 'Success',
      data: { user },
    };
  }

  @Post('login')
  public async signIn(@Body() payload: ILoginUser): Promise<IHttpResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase().trim(),
      },
    });

    if (user === null) {
      return {
        status: 401,
        message: 'Invalid credentials provided',
        data: null,
      };
    }

    const isValid = await comparePassword(payload.password, user.password);
    if (!isValid) {
      return {
        status: 401,
        message: 'Invalid credentials provided',
        data: null,
      };
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      status: 200,
      message: 'Success',
      data: { accessToken: createJwt(user) },
    };
  }

  @Get('send-email')
  public async sendEmail(): Promise<IHttpResponse> {
    sendNewEmail({ name: 'Daniel', email: 'd@gmail.com' });
    return {
      status: 200,
      message: 'Success',
      data: null,
    };
  }
}
