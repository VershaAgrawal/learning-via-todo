import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import swaggerDocs from "./utils/swagger";
import todos from "./routes/todos";
import { loginRateLimiter, todosRateLimiter } from "./controllers/rateLimit";
import user from "./routes/user";

const app = express();
const port = 5000;
const db = "mongodb://127.0.0.1:27017/todos"; //url, port 27017

mongoose
  .connect(db)
  .catch((err: { message: string }) =>
    console.error("Error while connecting to MongoDB" + err.message)
  ); //connecting to the db

app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    // for parsing application/x-www-form-urlencoded
    extended: true,
  })
);

app.use("/todos", todosRateLimiter, todos);

swaggerDocs(app, port);

app.use("/", loginRateLimiter, user);

app.use((req, res) => {
  res.status(404).json({ error: "API not found" });
});

app.listen(port, () => {
  console.log("Listening to port: " + port);
});
