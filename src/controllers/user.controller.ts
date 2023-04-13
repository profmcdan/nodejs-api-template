import prisma from '../config/databases';
import { comparePassword, createJwt, hashPassword } from '../modules/auth.module';
import { type IHttpResponse } from '../interfaces';
import { type ICreateUser, type ILoginUser, type IUpdateUser } from '../interfaces/user.interface';
import { Get, Post, Put, Delete, Route, Tags, Body } from 'tsoa';

@Route('api/v1/users')
@Tags('Users')
export default class UserController {
  @Get('/')
  public async getUsers(): Promise<IHttpResponse> {
    const users = await prisma.user.findMany();

    return {
      status: 200,
      message: 'Success',
      data: users,
    };
  }

  @Get('/:id')
  public async getOneUser(id: string): Promise<IHttpResponse> {
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
  public async updateUser(id: string, @Body() payload: IUpdateUser): Promise<IHttpResponse> {
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
  public async deleteUser(id: string): Promise<IHttpResponse> {
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
  public async registerUser(@Body() payload: ICreateUser): Promise<IHttpResponse> {
    const hashedPassword = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: {
        email: payload.email.toLowerCase().trim(),
        name: payload.name,
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

    return {
      status: 201,
      message: 'Success',
      data: user,
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
}
