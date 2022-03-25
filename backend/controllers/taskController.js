const asyncHandler = require("express-async-handler");
const Task = require("../models/userTasks");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("express");
const { mongo } = require("mongoose");
const { isValidObjectId } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const createTask = asyncHandler(async (req, res) => {
  const task = await new Task(req.body);
  const createdTask = await task.save();
  res.status(201).json(createdTask);

  if (!createdTask) {
    res.status(400);
    throw new Error("Invalid Task Input");
  }
});

const getTasks = asyncHandler(async (req, res) => {
  const header = req.headers["authentication"];
  const token = header.split(" ")[1];

  const user_data = jwt.decode(token);

  const userId = user_data._id;
  const tasks = await Task.find({ user_id: userId })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      if (err) {
        res.status(500);
        throw new Error(`Could not fetch doc ${docs}`);
      }
    });

  res.status(200).json(tasks);
});

const getTasksById = asyncHandler(async (req, res) => {
  // Task id Parameter
  const header = req.headers["authentication"];
  const token = header.split(" ")[1];

  const user_data = jwt.decode(token);

  const taskId = req.params.id;

  // Users id

  const userId = user_data._id;

  const tasks = await Task.find({
    _id: taskId,
    user_id: userId,
  })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      if (err) {
        res.status(500);
        throw new Error(`Could not fetch doc ${docs}`);
      }
    });
  res.status(200).json(tasks);
});

const getTasksByDay = asyncHandler(async (req, res) => {
  const header = req.headers["authentication"];
  const token = header.split(" ")[1];

  const user_data = jwt.decode(token);

  const userId = user_data._id;

  const date = req.params.day; // get a day -> 26
  // Users id -> Extract from JWT since GET does not take any body
  let startDate = 0;
  let endDate = 0;

  if (date.length === 8) {
    // parse
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6));
    const day = parseInt(date.substring(6, 8));

    try {
      startDate = new Date(year, month - 1, day);
      endDate = new Date(year, month - 1, day + 2);
    } catch (error) {
      res.status(400);
      throw new Error("Invalid Date Input");
    }
  }

  const tasks = await Task.find(
    {
      user_id: ObjectId(userId),
      startDate: {
        // $gte: startDate,
        $gte: new Date(startDate),
      },
      endDate: {
        $lte: new Date(endDate),
      },
      isStarted: true,
    },
    (err, docs) => {
      if (err) {
        res.status(500);
        throw new Error(`Could not fetch doc ${docs}`);
      }
    }
  );

  res.status(200).json(tasks);
});

const toggleTask = asyncHandler(async (req, res) => {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];

  const user_data = jwt.decode(token);

  const taskId = req.params.id;

  const userId = user_data._id;
  const taskDate = new Date();

  const task = await Task.findOne({
    _id: taskId,
    user_id: userId,
  })

    .then((docs) => {
      return docs;
    })
    .catch((err) => {
      res.status(500);
      throw new Error(`Could not fetch doc ${docs}`);
    });

  if (task && task.isStarted) {
    // stop the task
    task.isStarted = false;
    task.taskEndedDate = taskDate;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else if (task && !task.isStarted) {
    // start the task
    task.isStarted = true;
    task.taskStartedAt = taskDate;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error("Task not found");
  }
});

module.exports = {
  createTask,
  getTasks,
  getTasksByDay,
  getTasksById,
  toggleTask,
};
