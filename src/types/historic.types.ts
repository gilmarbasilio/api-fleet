import { RequestGenericInterface } from "fastify";

export interface Historic {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface IGetHistoriesRequest extends RequestGenericInterface {
  Querystring: {
    skip: number;
    take: number;
    status: string;
  };
}
export interface IGetHistoricRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}

export interface IAddHistoricRequest extends RequestGenericInterface {
  Body: Historic;
}

export interface IUpdateHistoricRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
  Body: Historic;
}

export interface IDeleteHistoricRequest extends RequestGenericInterface {
  Params: {
    id: string;
  };
}
