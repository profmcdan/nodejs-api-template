export type ICreateUser = {
  name: string;
  email: string;
  password: string;
  photo: string;
  role?: string;
};

export type IUpdateUser = {
  name: string;
  photo: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};
