const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  taskText: String,
  completed: Boolean,
  userId: mongoose.ObjectId,
});

module.exports = mongoose.model("Todo", TodoSchema);
