import { Request, Response, NextFunction } from "express";
import { Todo } from "../models/todo";
import { User } from "../models/user";

export async function checkTodosID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let _id = req.params._id;
  const idRegexp = /^[0-9a-fA-F]{24}$/;

  if (_id.match(idRegexp) && (await Todo.findOne({ _id: _id }))) return next();

  res.status(400).json({ error: "Invalid id" });
}

export async function checkUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let _id = req.params._id;
  const idRegexp = /^[0-9a-fA-F]{24}$/;

  if (_id.match(idRegexp) && (await User.findOne({ _id: _id }))) return next();

  res.status(400).json({ error: "Invalid id" });
}
