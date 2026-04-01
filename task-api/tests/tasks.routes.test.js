const request = require("supertest");
const app = require("../src/app");

test("GET /tasks should return 200", async () => {
  const res = await request(app).get("/tasks");

  expect(res.statusCode).toBe(200);
});



describe("POST /tasks", () => {
  test("should create a new task", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Learn testing",
      description: "Jest + Supertest",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Learn testing");
    expect(res.body.status).toBe("todo");
  });

  test("should fail if title is missing", async () => {
    const res = await request(app).post("/tasks").send({
      description: "No title here",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});




describe("GET /tasks pagination", () => {
  test("should return correct tasks for page 1", async () => {
    // reset (important)
    const taskService = require("../src/services/taskService");
    taskService._reset();

    // create 5 tasks
    for (let i = 0; i < 5; i++) {
      await request(app).post("/tasks").send({
        title: `Task ${i}`,
      });
    }

    const res = await request(app).get("/tasks?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    // 🔥 check actual data
    expect(res.body[0].title).toBe("Task 0");
    expect(res.body[1].title).toBe("Task 1");
  });
});



describe("GET /tasks status filter", () => {
  test("should return only tasks with exact status", async () => {
    const taskService = require("../src/services/taskService");
    taskService._reset();

    // create tasks
    await request(app).post("/tasks").send({ title: "Task 1", status: "todo" });
    await request(app).post("/tasks").send({ title: "Task 2", status: "done" });
    await request(app).post("/tasks").send({ title: "Task 3", status: "in_progress" });

    const res = await request(app).get("/tasks?status=do");

    expect(res.statusCode).toBe(200);

    // 🔥 Should NOT match partial strings
    expect(res.body.length).toBe(0);
  });
});





describe("PATCH /tasks/:id/assign", () => {
  test("should assign a task", async () => {
    const taskService = require("../src/services/taskService");
    taskService._reset();

    const createRes = await request(app).post("/tasks").send({
      title: "Task to assign",
    });

    const taskId = createRes.body.id;

    const res = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({ assignee: "Santosh" });

    expect(res.statusCode).toBe(200);
    expect(res.body.assignee).toBe("Santosh");
  });

  test("should return 400 for empty assignee", async () => {
    const taskService = require("../src/services/taskService");
    taskService._reset();

    const createRes = await request(app).post("/tasks").send({
      title: "Task",
    });

    const taskId = createRes.body.id;

    const res = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({ assignee: "" });

    expect(res.statusCode).toBe(400);
  });

  test("should return 404 if task not found", async () => {
    const res = await request(app)
      .patch("/tasks/invalid-id/assign")
      .send({ assignee: "Santosh" });

    expect(res.statusCode).toBe(404);
  });
});



test("should update a task", async () => {
  const createRes = await request(app).post("/tasks").send({
    title: "Old",
  });

  const res = await request(app)
    .put(`/tasks/${createRes.body.id}`)
    .send({ title: "New" });

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe("New");
});


test("should delete a task", async () => {
  const createRes = await request(app).post("/tasks").send({
    title: "Delete me",
  });

  const res = await request(app).delete(`/tasks/${createRes.body.id}`);

  expect(res.statusCode).toBe(204);
});

test("should mark task as complete", async () => {
  const createRes = await request(app).post("/tasks").send({
    title: "Complete me",
  });

  const res = await request(app).patch(
    `/tasks/${createRes.body.id}/complete`
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("done");
});

test("should return stats", async () => {
  await request(app).post("/tasks").send({ title: "A", status: "todo" });

  const res = await request(app).get("/tasks/stats");

  expect(res.statusCode).toBe(200);
  expect(res.body.todo).toBeDefined();
});