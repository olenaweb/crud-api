// testing HTTP requests to a running server

const request = require("supertest");

// Testing API on a local server running on port 4000
const baseURL = "http://localhost:4000";

describe("CRUD API Tests", () => {
  const testUser = {
    username: "John Doe",
    age: 30,
    hobbies: ["reading", "swimming"],
  };

  const updatedUser = {
    username: "John Updated",
    age: 31,
    hobbies: ["reading", "swimming", "coding"],
  };

  // SCENARIO 1: Full CRUD cycle (all 6 steps from the task)
  describe("Scenario 1: Complete CRUD cycle - all 6 steps from assignment", () => {
    let createdUserId: string;

    test("Step 1: Get all records with GET api/users request (empty array expected)", async () => {
      const response = await request(baseURL).get("/api/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("Step 2: New object created with POST api/users request (response with newly created record expected)", async () => {
      const response = await request(baseURL)
        .post("/api/users")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.age).toBe(testUser.age);
      expect(response.body.hobbies).toEqual(testUser.hobbies);

      createdUserId = response.body.id;
    });

    test("Step 3: Get created record by id with GET api/users/{userId} request (created record expected)", async () => {
      const response = await request(baseURL)
        .get(`/api/users/${createdUserId}`)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.age).toBe(testUser.age);
      expect(response.body.hobbies).toEqual(testUser.hobbies);
    });

    test("Step 4: Update created record with PUT api/users/{userId} request (response with updated object with same id expected)", async () => {
      const response = await request(baseURL)
        .put(`/api/users/${createdUserId}`)
        .send(updatedUser)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.age).toBe(updatedUser.age);
      expect(response.body.hobbies).toEqual(updatedUser.hobbies);
    });

    test("Step 5: Delete created object with DELETE api/users/{userId} request (successful deletion confirmation expected)", async () => {
      await request(baseURL).delete(`/api/users/${createdUserId}`).expect(204);
    });

    test("Step 6: Try to get deleted object with GET api/users/{userId} request (response that no such object exists expected)", async () => {
      const response = await request(baseURL)
        .get(`/api/users/${createdUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not found");
    });
  });

  // SCENARIO 2: Data Validation Testing
  describe("Scenario 2: Data Validation Testing", () => {
    test("Should return 400 for invalid user data in POST request", async () => {
      const invalidUser = {
        username: 123, // Should be string
        age: "thirty", // Should be number
        hobbies: "reading", // Should be array
      };

      const response = await request(baseURL)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    test("Should return 400 for missing required fields", async () => {
      const incompleteUser = {
        username: "Test User",
        // Missing age and hobbies
      };

      const response = await request(baseURL)
        .post("/api/users")
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    test("Should return 400 for invalid UUID format", async () => {
      const response = await request(baseURL)
        .get("/api/users/invalid-uuid-format")
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  // SCENARIO 3: Testing non-existent resources
  describe("Scenario 3: Testing non-existent resources", () => {
    test("Should return 404 for non-existent user ID", async () => {
      // Using a valid UUID format, but a non-existent ID
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";

      const response = await request(baseURL)
        .get(`/api/users/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not found");
    });

    test("Should return 404 when trying to update non-existent user", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440001";

      const response = await request(baseURL)
        .put(`/api/users/${nonExistentId}`)
        .send(updatedUser)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not found");
    });

    test("Should return 404 when trying to delete non-existent user", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440002";

      const response = await request(baseURL)
        .delete(`/api/users/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User not found");
    });

    test("Should return 404 for invalid endpoints", async () => {
      const response = await request(baseURL)
        .get("/api/invalid-endpoint")
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});
