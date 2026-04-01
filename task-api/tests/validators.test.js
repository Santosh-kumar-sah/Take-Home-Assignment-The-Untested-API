const {
  validateCreateTask,
  validateUpdateTask,
} = require("../src/utils/validators");

test("should fail if title is missing", () => {
  const err = validateCreateTask({});
  expect(err).toBeDefined();
});

test("should fail for invalid status", () => {
  const err = validateCreateTask({ title: "Test", status: "wrong" });
  expect(err).toBeDefined();
});

test("should pass valid task", () => {
  const err = validateCreateTask({ title: "Valid" });
  expect(err).toBeNull();
});

test("update should fail for empty title", () => {
  const err = validateUpdateTask({ title: "" });
  expect(err).toBeDefined();
});

test("should fail for invalid priority", () => {
  const err = validateCreateTask({
    title: "Test",
    priority: "urgent",
  });

  expect(err).toBeDefined();
});

test("should fail for invalid dueDate", () => {
  const err = validateCreateTask({
    title: "Test",
    dueDate: "invalid-date",
  });

  expect(err).toBeDefined();
});

test("update should fail for invalid status", () => {
  const err = validateUpdateTask({
    status: "wrong",
  });

  expect(err).toBeDefined();
});

test("update should fail for invalid dueDate", () => {
  const err = validateUpdateTask({
    dueDate: "bad-date",
  });

  expect(err).toBeDefined();
});


