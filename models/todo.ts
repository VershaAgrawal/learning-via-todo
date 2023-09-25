import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  taskText: String,
  completed: Boolean,
  userId: mongoose.Schema.Types.ObjectId,
});

export const Todo = mongoose.model("Todo", TodoSchema);
