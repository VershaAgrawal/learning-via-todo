const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var port = 5000;
var db = "mongodb://127.0.0.1:27017/todos"; //url, port 27017

var todos = require("./routes/todos");

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

app.listen(port, () => {
  console.log("Listening to port: " + port);
});
