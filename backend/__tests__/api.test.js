const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Task = require("../models/userTasks");
const Feedback = require("../models/feedbackModel");

let server;
let userId;
let jwt;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
  });
  server = app.listen();

  // Creating user that we're testing on
  const res = await request(app)
    .post("/api/users")
    .send({ email: "nestor@mail.utoronto.ca", password: "abcd" });
  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual("nestor@mail.utoronto.ca");
  userId = res.body._id;
});

describe("Example Test Suite", () => {
  it("Root url sample test", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Login Test Suite", () => {
  it("Valid Login", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "nestor@mail.utoronto.ca", password: "abcd" });
    expect(res.statusCode).toEqual(200);
    // expect(res.headers).toHaveProperty()
    expect(res.headers["set-cookie"][0]).toEqual(
      expect.stringContaining("token")
    );
    jwt = res.headers["set-cookie"][0].split(";")[0];
  });

  it("Invalid Login", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "nestor@mail.utoronto.ca", password: "" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Wrong password");
  });
});

describe("Getting Tasks Suite", () => {
  let taskObjectId;
  beforeAll(async () => {
    // Create task
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("cookie", jwt)
      .send({
        title: "Test Task",
        user_id: userId,
        description: "Test Task",
        endDate: new Date().toISOString(),
        isStarted: false,
      });
    taskObjectId = taskRes.body._id;
  });

  // it("Toggle Task (Already Started)", async () => {
  // //   const toggleTaskRes = await request(app)
  // //     .put(`/api/tasks/toggle/${taskObjectId}`)
  // //     .set("cookie", jwt);
  // //   expect(toggleTaskRes.body.isStarted).toEqual(false);
  // // });

  it("Getting All Tasks (Valid token)", async () => {
    const res = await request(app).get("/api/tasks").set("cookie", jwt);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Test Task" })])
    );
  });

  it("Getting All Tasks (Invalid token)", async () => {
    const res = await request(app).get("/api/tasks").set("cookie", "jwt");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Not authorized, token failed");
  });

  it("Getting Tasks by Date Range (Valid Token)", async () => {
    const res = await request(app)
      .get("/api/tasks?start=20220401&end=20270407")
      .set("cookie", jwt);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Test Task" })])
    );
  });

  it("Getting Tasks By Date Range (Invalid token)", async () => {
    const res = await request(app)
      .get("/api/tasks?start=20220401&end=20270407")
      .set("cookie", "jwt");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Not authorized, token failed");
  });

  it("Getting Tasks by id (Valid Token)", async () => {
    const res = await request(app)
      .get(`/api/tasks/task/${taskObjectId}`)
      .set("cookie", jwt);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Test Task" })])
    );
  });

  it("Getting Tasks by id (Invalid Token)", async () => {
    const res = await request(app)
      .get(`/api/tasks/task/${taskObjectId}`)
      .set("cookie", "jwt");

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Not authorized, token failed");
  });
});

describe("Create Task Suite", () => {
  it("Create Task (Valid Token)", async () => {
    const res = await request(app).post("/api/tasks").set("cookie", jwt).send({
      title: "Test Task",
      user_id: userId,
      description: "Test Task",
      endDate: new Date().toISOString(),
      isStarted: false,
    });
    expect(res.body.title).toEqual("Test Task");
    expect(res.body.user_id).toEqual(userId);
    expect(res.body.description).toEqual("Test Task");
    expect(res.body.isStarted).toEqual(false);
  });

  it("Create Task (Invalid token)", async () => {
    const res = await request(app).post("/api/tasks").set("cookie", "jwt");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Not authorized, token failed");
  });
});

describe("Create Feedback Suite", () => {
  let taskObjectId;
  beforeAll(async () => {
    // Create task
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("cookie", jwt)
      .send({
        title: "Test Task",
        user_id: userId,
        description: "Test Task",
        endDate: new Date().toISOString(),
        isStarted: false,
      });
    taskObjectId = taskRes.body._id;
  });

  it("Create Feedback (Valid Token)", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .set("cookie", jwt)
      .send({
        body: "Feedback from Chris on feedback branch: fix this",
        satisfaction: 9,
        user_id: userId,
        task_id: taskObjectId,
      });
    expect(res.body.body).toEqual(
      "Feedback from Chris on feedback branch: fix this"
    );
    expect(res.body.user_id).toEqual(userId);
    expect(res.body.satisfaction).toEqual(9);
    expect(res.body.body).toEqual(
      "Feedback from Chris on feedback branch: fix this"
    );
  });

  it("Create Task (Invalid token)", async () => {
    const res = await request(app).post("/api/feedback").set("cookie", "jwt");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Not authorized, token failed");
  });

  it("Create Feedback (Valid Token)", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .set("cookie", jwt)
      .send({
        body: "Feedback from Chris on feedback branch: fix this",
        user_id: userId,
        task_id: taskObjectId,
      });
    expect(res.body.message).toEqual("Invalid Feedback Input");
    expect(res.statusCode).toEqual(400);

    // 1. Add this for creating task
        // - Make changes to the controller similar to feedback
        // - I can do this all in this branch
    // 2. Add cleanup for feedback test cases
    // 3. Add additional test cases
            // - Cover more possible cases
            // - random false input
              // - Needs to be handled appropriately
            // - Cover all scenarios for get tasks route - 3 cases
            // - getting task by Id - test case with invalid id
  });
});

describe("Toggle Task Test Suite", () => {
  let taskObjectId;
  beforeAll(async () => {
    // Create task
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("cookie", jwt)
      .send({
        title: "Test Task",
        user_id: userId,
        description: "Test Task",
        endDate: new Date().toISOString(),
        isStarted: false,
      });
    taskObjectId = taskRes.body._id;
  });

  it("Toggle Task (Not Started Yet)", async () => {
    const toggleTaskRes = await request(app)
      .put(`/api/tasks/toggle/${taskObjectId}`)
      .set("cookie", jwt);
    expect(toggleTaskRes.body.isStarted).toEqual(true);
  });

  it("Toggle Task (Already Started)", async () => {
    const toggleTaskRes = await request(app)
      .put(`/api/tasks/toggle/${taskObjectId}`)
      .set("cookie", jwt);
    expect(toggleTaskRes.body.isStarted).toEqual(false);
  });

  it("Toggle Task (Already Ended)", async () => {
    const toggleTaskRes = await request(app)
      .put(`/api/tasks/toggle/${taskObjectId}`)
      .set("cookie", jwt);
    expect(toggleTaskRes.body.message).toEqual(
      `Couldn't start task. The task has already ended`
    );
    expect(toggleTaskRes.statusCode).toEqual(401);
  });
});

afterAll(async () => {
  const user = await User.findOne({ email: "nestor@mail.utoronto.ca" });
  await User.deleteOne(user);
  await Task.deleteMany({ title: "Test Task", user_id: userId });
  await Feedback.deleteMany({
    body: "Feedback from Chris on feedback branch: fix this",
  });
  mongoose.connection.close();
  server.close();
});
