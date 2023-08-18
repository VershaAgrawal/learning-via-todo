const Todo = require("../models/todo");
const postToSlack = require("./slackIntegration");
//fetch Todos
const fetchTodos = async () => {
  console.log("Fetching all the tasks");
  try {
    const todos = await Todo.find({}, { __v: 0 });
    return {
      statusCode: 200,
      body: { todos },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: { error: "Error while fetching todos: " + error.message },
    };
  }
};

//insert task
const insertTask = async (inputs) => {
  console.log("Inserting new task....");
  try {
    const taskText = inputs.taskText;

    if (taskText == "" || typeof taskText != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid taskText" },
      };

    const completed = false;
    const newTodo = new Todo({ taskText, completed });
    await newTodo.save();

    //const { __v, ...retTodo } = newTodo.toJSON(); //--- Destructing the JSON {versionKey variable, rest json variable}
    await postToSlack(newTodo.taskText);

    return {
      statusCode: 200,
      body: { todo: newTodo.toObject({ versionKey: false }) },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: { error: "Error while inserting new todo: " + error.message },
    };
  }
};

//update a task
const updateTask = async (inputs) => {
  console.log("Updating task details....");
  try {
    const { _id, completed, taskText } = inputs;
    const myTask = await Todo.findOne({ _id: _id });

    if (typeof completed != "undefined") {
      if (typeof completed != "boolean")
        return {
          statusCode: 400,
          body: { error: "Invalid completion status" },
        };
      myTask.completed = completed;
    }

    if (typeof taskText != "undefined") {
      if (taskText == "" || typeof taskText != "string")
        return {
          statusCode: 400,
          body: { error: "Invalid completion status" },
        };
      myTask.taskText = taskText;
    }

    await myTask.save();
    return {
      statusCode: 200,
      body: { todo: myTask.toObject({ versionKey: false }) },
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: { error: "Error while updating task details: " + err.message },
    };
  }
};

//deleting a task
const deleteTask = async (inputs) => {
  console.log("Deleteing a task.....");
  try {
    const _id = inputs._id;
    const taskToDel = await Todo.findOne({ _id: _id });
    const delTask = await Todo.deleteOne({ _id: _id });
    return {
      statusCode: 200,
      body: {
        todo: taskToDel.toObject({ versionKey: false }),
      },
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: {
        error: "Error while deleting todo: " + err.message,
      },
    };
  }
};

module.exports = { fetchTodos, insertTask, deleteTask, updateTask };
