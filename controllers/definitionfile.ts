import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
  user?: any;
}

export interface FetchTodosInput {
  userId: any;
  page?: Number;
  limit?: Number;
  taskText?: String;
  completed?: Boolean;
}

export interface TodosInput {
  userId: any;
  taskText?: String;
  completed?: Boolean;
}
