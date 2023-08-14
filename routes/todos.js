const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();

const checkID = require("../controllers/validation");

const {
  fetchTodos,
  insertTask,
  deleteTask,
  updateTask,
} = require("../controllers/todos");

//Fetching all the task
router.get("/", async (req, res) => {
  const retJson = await fetchTodos();
  res.status(retJson.statusCode).json(retJson.body);
});

//Inserting a new task
router.post("/", async (req, res) => {
  const retJson = await insertTask(req.body);
  res.status(retJson.statusCode).json(retJson.body);
});

//Updating task status
router.put("/:_id", checkID, async (req, res) => {
  const retJson = await updateTask({ ...req.params, ...req.body });
  res.status(retJson.statusCode).json(retJson.body);
});

//Deleting  a task

router.delete("/:_id", checkID, async (req, res) => {
  const retJson = await deleteTask(req.params);
  res.status(retJson.statusCode).json(retJson.body);
});

module.exports = router;
