import express, { Response } from "express";
import { User } from "../models/user";
import { IGetUserAuthInfoRequest } from "../controllers/definitionfile";
import { checkTodosID } from "../controllers/validation";
import {
  fetchTodos,
  insertTask,
  deleteTask,
  updateTask,
  batchInsertTask,
} from "../controllers/todos";
import { verifyToken } from "../controllers/user";

const router = express.Router();

//Fetching all the task

/**
 * @openapi
 * /todos:
 *  get:
 *   tag:
 *   - Fetch task
 *   description: Fetches all the task of the user
 *   responses:
 *     200:
 *      description: Returns a json
 */
router.get(
  "/",
  verifyToken,
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = await User.findOne({ _id: req.user._id }, { _id: 1 });
    if (userId) {
      const retJson = await fetchTodos({ userId: userId._id, ...req.query });
      res.status(retJson.statusCode).json(retJson.body);
    }
  }
);

//Inserting a new task
router.post(
  "/",
  verifyToken,
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = await User.findOne({ _id: req.user._id }, { _id: 1 });
    const retJson = await insertTask({ ...req.body, userId: userId?._id });
    res.status(retJson.statusCode).json(retJson.body);
  }
);

//Updating task status
router.put("/:_id", verifyToken, checkTodosID, async (req, res) => {
  const retJson = await updateTask({ ...req.params, ...req.body });
  res.status(retJson?.statusCode || 400).json(retJson?.body);
});

//Deleting  a task
router.delete("/:_id", verifyToken, checkTodosID, async (req, res) => {
  const retJson = await deleteTask(req.params);
  res.status(retJson?.statusCode || 400).json(retJson?.body);
});

//bactch API for inserting multiple tasks
router.post(
  "/batch",
  verifyToken,
  async (req: IGetUserAuthInfoRequest, res) => {
    const userId = await User.findOne({ _id: req.user._id }, { _id: 1 });
    const retJson = await batchInsertTask({ ...req.body, userId: userId?._id });
    res.status(retJson.statusCode).json(retJson.body);
  }
);

export default router;
