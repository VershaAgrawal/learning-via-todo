const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();

const checkID = async (req, res, next) => {
  let _id = req.params._id;
  const idRegexp = /^[0-9a-fA-F]{24}$/;

  if (_id.match(idRegexp) && (await Todo.findOne({ _id: _id }))) return next();

  res.status(400).json({ error: "Invalid id" });
};

//Fetching all the task
router.get("/", async (req, res) => {
  console.log("Fetching all the tasks");
  try {
    const todos = await Todo.find({}, { __v: 0 });
    res.json({ todos });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error while fetching todos: " + error.message });
  }
});

//Inserting a new task
router.post("/", async (req, res) => {
  console.log("Inserting new task....");
  try {
    const taskText = req.body.taskText;

    if (taskText == "" || typeof taskText != "string")
      return res.status(400).json({ error: "Invalid taskText" });

    const completed = false;
    const newTodo = new Todo({ taskText, completed });
    await newTodo.save();
    // const { __v, ...retTodo } = newTodo.toJSON();--- Destructing the JSON {versionKey variable, rest json variable}
    res.json({ todo: newTodo.toObject({ versionKey: false }) });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error while inserting new todo: " + error.message });
  }
});

//Updating task status
router.put("/:_id", checkID, async (req, res) => {
  console.log("Updating task details....");
  try {
    const id = req.params._id;
    const { completed, taskText } = req.body;
    const myTask = await Todo.findOne({ _id: id });

    if (typeof completed != "undefined") {
      if (typeof completed != "boolean")
        return res.status(400).json({ error: "Invalid completion status" });
      myTask.completed = completed;
    }

    if (typeof taskText != "undefined") {
      if (taskText == "" || typeof taskText != "string")
        return res.status(400).json({ error: "Invalid taskText" });
      myTask.taskText = taskText;
    }

    await myTask.save();
    res.json({ todo: myTask.toObject({ versionKey: false }) });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while updating task details: " + err.message });
  }
});

//Deleting

router.delete("/:_id", checkID, async (req, res) => {
  console.log("Deleteing a task.....");
  try {
    const id = req.params._id;
    const taskToDel = await Todo.findOne({ _id: id });
    const delTask = await Todo.deleteOne({ _id: id });
    res.json({ todo: taskToDel.toObject({ versionKey: false }) });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while deleting todo: " + err.message });
  }
});

module.exports = router;
