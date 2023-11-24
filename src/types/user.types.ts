import { RequestGenericInterface } from "fastify";

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface IGetUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}

export interface IAddUserRequest extends RequestGenericInterface {
  Body: User;
}

export interface IUpdateUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
  Body: User;
}

export interface IDeleteUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}

export interface IUpdatePhotoRequest extends RequestGenericInterface {
  Body: {
    photo: string;
  };
}
