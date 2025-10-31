# Mini Project Manager – Projects, Tasks & Smart Scheduler

**A modern full-stack mini project manager built with .NET (C#) and React + TypeScript using Tailwind CSS.**

---

## 🔗 Deployment Details

- **Live App (Integrated):** [https://miniprojectmanager.vercel.app/](https://miniprojectmanager.vercel.app/ )

## 🔗 Frontend and Backend Deployed Link
- **Vercel (Frontend):** `https://miniprojectmanager.vercel.app/` 
- Render (Backend): ` https://mini-project-manager-7fsq.onrender.com ` 

---

## Overview

The Mini Project Manager demonstrates clean API design, JWT-based auth, and an interactive React frontend. Users can create projects, manage tasks within each project, and use a smart scheduler to generate an optimal execution order based on dependencies, due dates, and effort.

### Core Capabilities

- User authentication: Register, Login (JWT)
- Create, list, edit, and delete projects
- Add, edit, complete, and delete tasks per project
- Bulk project creation with duplicate-title protection
- Smart Scheduler with dependency ordering and duplicate detection
- Filters, sort by due date, visual progress tracking
- Responsive UI with light/dark themes and helpful guidance

---

## My Key Contributions (What I Implemented)

### Backend (.NET – C#)

- Built REST endpoints with clean separation of concerns:
  - `POST /api/auth/register` → Register user and return JWT
  - `POST /api/auth/login` → Login and return JWT
  - `GET /api/projects` → List projects for current user
  - `POST /api/projects` → Create project (title validation + duplicates check per user)
  - `GET /api/projects/{id}` → Get project details with tasks
  - `DELETE /api/projects/{id}` → Delete user-owned project
  - `POST /api/projects/bulk` → Create multiple projects at once (ignores duplicates)
  - `GET /api/projects/stats` → Quick stats (today / this week / total)
  - `POST /api/projects/{projectId}/tasks` → Add task to a project
  - `PUT /api/tasks/{taskId}` → Update task (title, due date, completion)
  - `DELETE /api/tasks/{taskId}` → Delete task
  - `POST /api/v1/projects/{projectId}/schedule` → Smart schedule order with validations
- Implemented JWT generation/validation and per-user data isolation
- Added request validation and friendly error messages

### Frontend (React + TypeScript)

- Auth UI (Login/Signup) with token storage and protected routes
- Project dashboard with create/edit/delete and bulk add
- Per-project task management with inline edits and completion
- Sorting, filtering, progress bar, and responsive layout
- Smart Scheduler UI: submit tasks with dependencies and view recommended order
- Polished UI using Tailwind; reusable components and clean state management

---

## Tech Stack

| Layer           | Technology                                  | Purpose                                  |
| --------------- | ------------------------------------------- | ---------------------------------------- |
| **Frontend**    | React + TypeScript                          | SPA for project/task management          |
| **Backend**     | .NET (C#)                                    | RESTful API + JWT auth                   |
| **UI Library**  | Tailwind CSS                                | Modern responsive UI                     |
| **Auth**        | JWT                                         | Secure API access                        |
| **Docs**        | Swagger UI + Markdown                       | Testing & documentation                  |

---

## ⚙️ Setup Instructions

### Clone Repository

```bash
git clone https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025.git
cd "PLC-Home-Coding-assignment-Oct-2025/mini-project-manager"
```

### 🖥️ Backend Setup (.NET)

```bash
cd backend
dotnet restore
dotnet run
```

- Default launch prints the HTTP URL in console (commonly `http://localhost:5000`).

### 💻 Frontend Setup (React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

- Runs on → `http://localhost:5173` (by default)
- Configure API base if needed (e.g. using `.env`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🌐 API Endpoints (Key)

| Endpoint                                           | Method | Description                          |
| -------------------------------------------------- | ------ | ------------------------------------ |
| `/api/auth/register`                               | POST   | Register and return JWT              |
| `/api/auth/login`                                  | POST   | Login and return JWT                 |
| `/api/projects`                                    | GET    | List projects for current user       |
| `/api/projects`                                    | POST   | Create project                       |
| `/api/projects/{id}`                               | GET    | Project details + tasks              |
| `/api/projects/{id}`                               | DELETE | Delete project                       |
| `/api/projects/bulk`                               | POST   | Bulk create projects                 |
| `/api/projects/stats`                              | GET    | Stats (total/this week/today)        |
| `/api/projects/{projectId}/tasks`                  | POST   | Add task to a project                |
| `/api/tasks/{taskId}`                              | PUT    | Update task                          |
| `/api/tasks/{taskId}`                              | DELETE | Delete task                          |
| `/api/v1/projects/{projectId}/schedule`            | POST   | Smart schedule (order tasks)         |

**Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret"}'
```

---

## 🚀 Deployment

- **Frontend (Vercel):**
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`

- **Backend (Render):**
  - Build & run: `dotnet publish -c Release`
  - Expose generated executable or `MiniProjectManager.dll`
  - Enable CORS for the frontend origin


---

## Features Summary

| Category            | Features                                                              |
| ------------------- | --------------------------------------------------------------------- |
| **Auth**            | Register, Login, JWT-protected routes                                 |
| **Projects**        | Create, List, Edit, Delete, Bulk Add, Stats                           |
| **Tasks**           | Add, Edit, Complete, Delete per project                               |
| **Scheduler**       | Dependency-aware order, duplicate detection, due-date prioritization  |
| **Organization**    | Filters, Sort by due date                                             |
| **Tracking**        | Visual progress bar                                                   |
| **Design**          | Light/Dark themes, responsive layout                                  |
| **Usability**       | Helpful guidance and clean UX                                         |

---

## Screenshots (Demo)

| Screen                               | Preview |
| ------------------------------------ | ------- |
| Welcome Screen (Light)               | ![Welcome Screen (Light)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Welcome%20Screen%20light%20mode.png)    |
| Welcome Screen (Dark)                | ![Welcome Screen (Dark)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Welcome%20screen%20dark%20mode%20.png)    |
| Login                                | ![Login](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/login.png)    |
| Register                             | ![Register](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/signup.png)    |
| Navbar                               | ![Navbar](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/navbar%20.png)    |
| Projects Created                     | ![Projects Created](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Projects%20created.png)    |
| Create Project (Manual)              | ![Create Project (Manual)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Create%20Projects%20Manually.png)    |
| Bulk Create Projects                 | ![Bulk Create Projects ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Add%20projects%20in%20Bulk%20.png)    |
| Export all Projects in json          | ![Export all Projects in json ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/e7a6f689858fd923e158567785f59e54f167df56/mini-project-manager/Screenshot%20of%20the%20App/export.png)    |
| Edit Project                         | ![Edit Project](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Edit%20Projects.png)    |
| Delete Project                       | ![Delete Project  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Delete%20projects.png)    |
| Add Task                             | ![Add Task  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20added.png)    |
| Edit Task                            | ![Edit Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20Edit.png)    |
| Task Completed                       | ![Task Completed ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20Completed.png)    |
| Delete Task                          | ![Delete Task   ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/delete%20task.png)    |
| Filters                              | ![Filters   ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Filters.png)    |
| Sort by Due Date                     | ![Sort by Due Date  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Sort%20by%20due%20date.png)    |
| Progress Tracker                     | ![Progress Tracker ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Progress%20bar.png)    |
| Smart Scheduler                      | ![Smart Scheduler ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Smart%20Scheduler.png)    |
| Duplicate Tasks Finder               | ![Duplicate Tasks Finder](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Smart%20Scheduler%20duplicate%20tasks%20finder.png)    |
| Help Desk                            | ![Help Desk](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Help%20desk.png)    |
| Responsive (All Devices)             | ![Responsive (All Devices)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Responsive%20for%20all%20devices.png)    |

---

## Author

**Developed by:** Manav Rai  
**Institution:** Punjab Engineering College, Chandigarh  
**Email:** [manavrai454@gmail.com](mailto:manavrai454@gmail.com)  
**GitHub:** [github.com/manavrai454](https://github.com/coderiders22/)

---

## License

Released under the **MIT License**  
© 2025 **Manav Rai**. All rights reserved.

---
