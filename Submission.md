## Submission Note

### What I implemented

- Wrote **unit tests** for the service layer and **integration tests** for all API routes using Jest and Supertest  
- Achieved **~94% test coverage**, ensuring most critical paths and edge cases are validated  
- Identified and fixed bugs through testing (pagination logic and status filtering)  
- Implemented the new endpoint:  
  `PATCH /tasks/:id/assign` with validation and error handling  

---

### Bugs Found

#### 1. Incorrect Pagination Logic
- **Root cause:** wrong offset calculation (`page * limit`)  
- **Fix:** updated to `(page - 1) * limit`  

#### 2. Incorrect Status Filtering
- **Root cause:** partial matching using `.includes()`  
- **Fix:** replaced with strict equality (`===`)  

---

### Design Decisions (Assign Task Feature)

- Assignee must be a **non-empty string** to ensure valid data  
- Allowed **reassignment** (overwrites existing assignee) for flexibility  
- Returns:
  - `404` if task not found  
  - `400` for invalid input  

---



### What surprised me

- Small logic issues (like pagination and filtering) can silently produce incorrect results without failing outright  
- Writing tests first made it easier to **discover bugs organically** rather than manually inspecting code  

---


### Test Coverage Summary

Test Coverage
All files     | 94.03% Stmts | 88.09% Branch | 93.1% Funcs | 93.43% Lines
Total Tests: 36
Test Suites: 3
Status: All Passing