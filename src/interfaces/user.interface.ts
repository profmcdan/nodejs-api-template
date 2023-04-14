export type ICreateUser = {
  name: string;
  email: string;
  password: string;
  photo: string;
  role?: 'admin' | 'user';
};

export type IUpdateUser = {
  name: string;
  photo: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IPageListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
};
