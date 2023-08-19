const Todo = require("../models/todo");
const User = require("../models/user");

const checkTodosID = async (req, res, next) => {
  let _id = req.params._id;
  const idRegexp = /^[0-9a-fA-F]{24}$/;

  if (_id.match(idRegexp) && (await Todo.findOne({ _id: _id }))) return next();

  res.status(400).json({ error: "Invalid id" });
};

const checkUserId = async (req, res, next) => {
  let _id = req.params._id;
  const idRegexp = /^[0-9a-fA-F]{24}$/;

  if (_id.match(idRegexp) && (await User.findOne({ _id: _id }))) return next();

  res.status(400).json({ error: "Invalid id" });
};

module.exports = { checkTodosID, checkUserId };
