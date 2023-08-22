const Todo = require("../models/todo");
const postToSlack = require("./slackIntegration");
const User = require("../models/user");
//fetch Todos
const fetchTodos = async (inputs) => {
  console.log("Fetching all the tasks");
  try {
    const userId = inputs.userId;
    const page = inputs.page || 1;
    const limit = inputs.limit || 5;
    const skip = (page - 1) * limit;

    const promTodos = Todo.find({ userId: userId }, { __v: 0 })
      .skip(skip)
      .limit(limit);

    const promCountTodo = Todo.countDocuments({ userId: userId });

    const [todos, countTodo] = await Promise.all([promTodos, promCountTodo]);
    const noOfPages = countTodo / limit;

    return {
      statusCode: 200,
      body: { totalPages: noOfPages, todos: todos },
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
    const { taskText, userId } = inputs;

    if (taskText == "" || typeof taskText != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid taskText" },
      };

    const completed = false;
    const newTodo = new Todo({ taskText, completed, userId });

    await newTodo.save();

    const user = await User.findOne({ _id: userId }, { slackUrl: 1 });
    if (typeof user.slackUrl != "undefined") {
      await postToSlack({
        taskText: newTodo.taskText,
        slackUrl: user.slackUrl,
      });
    }

    //const { __v, ...retTodo } = newTodo.toJSON(); //--- Destructing the JSON {versionKey variable, rest json variable}
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

//inserting multiple tasks
const batchInsertTask = async (inputs) => {
  const { todos, userId } = inputs;

  const arrProm = todos.map((oneTask) => {
    return insertTask({ taskText: oneTask.taskText, userId });
  });
  const retArrs = await Promise.all(arrProm); //retArrs-> array of resolved promises

  return {
    statusCode: 200,
    body: { todos: retArrs },
  };
};

module.exports = {
  fetchTodos,
  insertTask,
  deleteTask,
  updateTask,
  batchInsertTask,
};
