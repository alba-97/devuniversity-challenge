import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import app from "../app";

describe("Authentication API", () => {
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
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("email", "test@example.com");
    });

    it("should reject registration with existing email", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "User already exists");
    });

    it("should reject registration with invalid email", async () => {
      const invalidUser = {
        ...validUser,
        email: "invalid-email",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    const testUser = {
      username: "loginuser",
      email: "login@example.com",
      password: "password123",
    };

    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("email", "login@example.com");
    });

    it("should reject login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "somepassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
