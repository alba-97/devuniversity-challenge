import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import Task from "../models/Task";
import { TaskStatus, TaskPriority } from "../models/Task";

describe("Task API", () => {
  let authCookie: string;
  let userId: string;

  beforeAll(async () => {
    const testMongoURI =
      process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/todo_app_test";

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(testMongoURI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create a test user and get authentication token
    const testUser = {
      username: "taskuser",
      email: "task@example.com",
      password: "password123",
    };

    await request(app).post("/api/auth/register").send(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    // Extract the cookie from the login response
    authCookie = loginResponse.headers["set-cookie"];
    console.log(111111111111, authCookie);
    userId = loginResponse.body.userId;
  });

  describe("POST /api/tasks", () => {
    it("should create a new task successfully", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", authCookie)
        .send(taskData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        title: "Test Task",
        description: "This is a test task",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        user: userId,
      });
    });

    it("should reject task creation without authentication", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
      };

      const response = await request(app).post("/api/tasks").send(taskData);

      expect(response.statusCode).toBe(401);
    });

    it("should use default values for optional fields", async () => {
      const taskData = {
        title: "Minimal Task",
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", authCookie)
        .send(taskData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        title: "Minimal Task",
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
    });
  });

  describe("GET /api/tasks", () => {
    it("should retrieve tasks for authenticated user", async () => {
      // Create some test tasks
      const tasks = [
        {
          title: "Task 1",
          description: "First task",
          user: userId,
          status: TaskStatus.PENDING,
          priority: TaskPriority.HIGH,
        },
        {
          title: "Task 2",
          description: "Second task",
          user: userId,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM,
        },
      ];

      await Task.insertMany(tasks);

      const response = await request(app)
        .get("/api/tasks")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toMatchObject(tasks[0]);
      expect(response.body[1]).toMatchObject(tasks[1]);
    });

    it("should return empty array if no tasks exist", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it("should reject task retrieval without authentication", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should retrieve a specific task by ID", async () => {
      const task = new Task({
        title: "Specific Task",
        description: "Task to retrieve",
        user: userId,
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
      await task.save();

      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        _id: `${task._id}`,
        title: "Specific Task",
        description: "Task to retrieve",
      });
    });

    it("should return 404 for non-existent task", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update an existing task", async () => {
      const task = new Task({
        title: "Original Task",
        description: "Task to update",
        user: userId,
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
      await task.save();

      const updateData = {
        title: "Updated Task",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Cookie", authCookie)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        _id: `${task._id}`,
        title: "Updated Task",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
      });
    });

    it("should reject task update for unauthorized user", async () => {
      const otherUser = await User.create({
        username: "otheruser",
        email: "other@example.com",
        password: "password123",
      });

      const task = new Task({
        title: "Another Task",
        description: "Task owned by another user",
        user: otherUser._id,
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
      await task.save();

      const updateData = {
        title: "Attempted Update",
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Cookie", authCookie)
        .send(updateData);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete an existing task", async () => {
      const task = new Task({
        title: "Task to Delete",
        description: "Will be deleted",
        user: userId,
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
      await task.save();

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it("should reject task deletion for unauthorized user", async () => {
      const otherUser = await User.create({
        username: "otheruser",
        email: "other@example.com",
        password: "password123",
      });

      const task = new Task({
        title: "Another Task",
        description: "Task owned by another user",
        user: otherUser._id,
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
      });
      await task.save();

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(403);
    });
  });
});
