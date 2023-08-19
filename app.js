const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 5000;
const db = "mongodb://127.0.0.1:27017/todos"; //url, port 27017

const todos = require("./routes/todos");
const user_authentication = require("./routes/user");
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

app.use("/todos", todos);
app.use("/", user_authentication);

app.listen(port, () => {
  console.log("Listening to port: " + port);
});
