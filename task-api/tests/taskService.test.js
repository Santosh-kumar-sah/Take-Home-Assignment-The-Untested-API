const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset(); 
});

test("should create a task", () => {
  const task = taskService.create({ title: "Test Task" });

  expect(task).toHaveProperty("id");
  expect(task.title).toBe("Test Task");
  expect(task.status).toBe("todo");
});

test("should get all tasks", () => {
  taskService.create({ title: "A" });
  taskService.create({ title: "B" });

  const tasks = taskService.getAll();

  expect(tasks.length).toBe(2);
});

test("should find task by id", () => {
  const task = taskService.create({ title: "Find me" });

  const found = taskService.findById(task.id);

  expect(found).toBeDefined();
  expect(found.id).toBe(task.id);
});

test("should return undefined for invalid id in findById", () => {
  const result = taskService.findById("invalid-id");

  expect(result).toBeUndefined();
});

test("should filter tasks by exact status", () => {
  taskService.create({ title: "T1", status: "todo" });
  taskService.create({ title: "T2", status: "done" });

  const todos = taskService.getByStatus("todo");

  expect(todos.length).toBe(1);
  expect(todos[0].status).toBe("todo");
});

test("should paginate tasks correctly", () => {
  for (let i = 0; i < 5; i++) {
    taskService.create({ title: `Task ${i}` });
  }

  const page1 = taskService.getPaginated(1, 2);

  expect(page1.length).toBe(2);
  expect(page1[0].title).toBe("Task 0");
});

test("should update a task", () => {
  const task = taskService.create({ title: "Old" });

  const updated = taskService.update(task.id, { title: "New" });

  expect(updated.title).toBe("New");
});

test("should return null when updating non-existing task", () => {
  const result = taskService.update("wrong-id", { title: "Test" });

  expect(result).toBeNull();
});

test("should delete a task", () => {
  const task = taskService.create({ title: "Delete me" });

  const result = taskService.remove(task.id);

  expect(result).toBe(true);
  expect(taskService.getAll().length).toBe(0);
});

test("should return false when deleting non-existing task", () => {
  const result = taskService.remove("wrong-id");

  expect(result).toBe(false);
});

test("should complete a task", () => {
  const task = taskService.create({ title: "Complete me" });

  const updated = taskService.completeTask(task.id);

  expect(updated.status).toBe("done");
  expect(updated.completedAt).toBeDefined();
});

test("should return null when completing invalid task", () => {
  const result = taskService.completeTask("wrong-id");

  expect(result).toBeNull();
});

test("should assign task to user", () => {
  const task = taskService.create({ title: "Assign me" });

  const updated = taskService.assignTask(task.id, "Santosh");

  expect(updated.assignee).toBe("Santosh");
});

test("should return null when assigning invalid task", () => {
  const result = taskService.assignTask("wrong-id", "User");

  expect(result).toBeNull();
});

test("should calculate stats correctly including overdue", () => {
  taskService.create({ title: "T1", status: "todo" });
  taskService.create({ title: "T2", status: "done" });
  taskService.create({
    title: "T3",
    status: "todo",
    dueDate: "2026-01-04", 
  });

  const stats = taskService.getStats();

  expect(stats.todo).toBe(2);
  expect(stats.done).toBe(1);
  expect(stats.overdue).toBe(1);
});