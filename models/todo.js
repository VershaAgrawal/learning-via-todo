const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  taskText: String,
  completed: Boolean,
  userId: String,
});

module.exports = mongoose.model("Todo", TodoSchema);
