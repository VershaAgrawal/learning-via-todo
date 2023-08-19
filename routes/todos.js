const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();
const User = require("../models/user");

const { checkTodosID } = require("../controllers/validation");

const {
  fetchTodos,
  insertTask,
  deleteTask,
  updateTask,
} = require("../controllers/todos");

const { verifyToken } = require("../controllers/user_authentication");
//Fetching all the task
router.get("/", verifyToken, async (req, res) => {
  const userId = await User.findOne({ _id: req.user._id }, "_id");
  const retJson = await fetchTodos({ userId: userId._id });
  res.status(retJson.statusCode).json(retJson.body);
});

//Inserting a new task
router.post("/", verifyToken, async (req, res) => {
  console.log(req.user);
  const userId = await User.findOne({ _id: req.user._id }, "_id");
  const retJson = await insertTask({ ...req.body, userId: userId._id });
  res.status(retJson.statusCode).json(retJson.body);
});

//Updating task status
router.put("/:_id", verifyToken, checkTodosID, async (req, res) => {
  const retJson = await updateTask({ ...req.params, ...req.body });
  res.status(retJson.statusCode).json(retJson.body);
});

//Deleting  a task

router.delete("/:_id", verifyToken, checkTodosID, async (req, res) => {
  const retJson = await deleteTask(req.params);
  res.status(retJson.statusCode).json(retJson.body);
});

module.exports = router;
