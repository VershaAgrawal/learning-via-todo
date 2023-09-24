import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  emailId: { type: String, unique: true },
  password: String,
  slackUrl: String,
});
export const User = mongoose.model("User", UserSchema);
