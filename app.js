const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 5000;
const db = "mongodb://127.0.0.1:27017/todos"; //url, port 27017

const todos = require("./routes/todos");
const {
  loginRateLimiter,
  todosRateLimiter,
} = require(".//controllers/rateLimit");

const user = require("./routes/user");
mongoose
  .connect(db)
  .catch((err) =>
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

app.use("/", loginRateLimiter, user);

app.use((req, res) => {
  res.status(404).json({ error: "API not found" });
});

app.listen(port, () => {
  console.log("Listening to port: " + port);
});
