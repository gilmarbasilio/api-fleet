import { RequestGenericInterface } from "fastify";

export interface IGetUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}

export interface IAddUserRequest extends RequestGenericInterface {
  Body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface IUpdateUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
  Body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface IDeleteUserRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}
