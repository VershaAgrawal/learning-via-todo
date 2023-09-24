import { Todo } from "../models/todo";
import { postToSlack } from "./slackIntegration";
import { User } from "../models/user";
import { FetchTodosInput } from "./definitionfile";
import { TodosInput } from "./definitionfile";

//fetch Todos
export async function fetchTodos(inputs: FetchTodosInput) {
  console.log("Fetching all the tasks");
  try {
    const userId = inputs.userId;
    const page = Number(inputs.page || "1");
    const limit = Number(inputs.limit || "5");
    const taskText = inputs.taskText;
    const completed = inputs.completed;

    if (!Number.isInteger(page) || page < 1)
      throw new Error("Page should be a valid number.");
    if (!Number.isInteger(limit) || limit < 1)
      throw new Error("Limit should be a valid number.");
    const skip = (page - 1) * limit;

    const whereClause: TodosInput = {
      userId: userId,
    };

    if (taskText) {
      whereClause.taskText = taskText;
    }
    if (completed) {
      whereClause.completed = completed;
    }

    const promTodos = Todo.find(whereClause, { __v: 0 })
      .skip(skip)
      .limit(limit);

    const promCountTodo = Todo.countDocuments({ userId: userId });

    const [todos, countTodo] = await Promise.all([promTodos, promCountTodo]);
    const noOfPages = Math.ceil(countTodo / limit);

    return {
      statusCode: 200,
      body: { totalPages: noOfPages, todos: todos },
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: { error: "Error while fetching todos: " + error.message },
    };
  }
}

//insert task
export async function insertTask(inputs: TodosInput) {
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
    if (user) {
      if (
        typeof newTodo.taskText != "undefined" &&
        typeof user.slackUrl != "undefined"
      ) {
        await postToSlack({
          taskText: newTodo.taskText,
          slackUrl: user.slackUrl,
        });
      }
    }

    //const { __v, ...retTodo } = newTodo.toJSON(); //--- Destructing the JSON {versionKey variable, rest json variable}
    return {
      statusCode: 200,
      body: { todo: newTodo.toObject({ versionKey: false }) },
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: { error: "Error while inserting new todo: " + error.message },
    };
  }
}

//update a task
export async function updateTask(inputs: {
  _id: any;
  completed: any;
  taskText: any;
}) {
  console.log("Updating task details....");
  try {
    const { _id, completed, taskText } = inputs;
    const myTask = await Todo.findOne({ _id: _id });
    if (myTask) {
      if (typeof completed != "undefined") {
        if (typeof completed != "boolean")
          return {
            statusCode: 400,
            body: { error: "Invalid completion status" },
          };
        if (myTask) myTask.completed = completed;
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
    }
  } catch (err: any) {
    return {
      statusCode: 400,
      body: { error: "Error while updating task details: " + err.message },
    };
  }
}

//deleting a task
export async function deleteTask(inputs: { _id?: string }) {
  console.log("Deleteing a task.....");
  try {
    const _id = inputs._id;
    const taskToDel = await Todo.findOne({ _id: _id });
    const delTask = await Todo.deleteOne({ _id: _id });
    if (taskToDel) {
      return {
        statusCode: 200,
        body: {
          todo: taskToDel.toObject({ versionKey: false }),
        },
      };
    }
  } catch (err: any) {
    return {
      statusCode: 400,
      body: {
        error: "Error while deleting todo: " + err.message,
      },
    };
  }
}

//inserting multiple tasks
export async function batchInsertTask(inputs: { todos: any; userId: any }) {
  const { todos, userId } = inputs;

  const arrProm = todos.map((oneTask: { taskText: any }) => {
    return insertTask({ taskText: oneTask.taskText, userId });
  });
  const retArrs = await Promise.all(arrProm); //retArrs-> array of resolved promises

  return {
    statusCode: 200,
    body: { todos: retArrs },
  };
}
