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

- Once deployed, update the links in the Deployment section above.

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
| Welcome Screen (Light)               | [ Welcome Screen (Light)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Welcome%20Screen%20light%20mode.png)    |
| Welcome Screen (Dark)                | [Welcome Screen (Dark)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Welcome%20screen%20dark%20mode%20.png)    |
| Login                                | [Login](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/login.png)    |
| Register                             | [Register](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/signup.png)    |
| Navbar                               | [Navbar](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/navbar%20.png)    |
| Projects Created                     | [Projects Created](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Projects%20created.png)    |
| Create Project (Manual)              | [Create Project (Manual)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Create%20Projects%20Manually.png)    |
| Bulk Create Projects                 | [Bulk Create Projects ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Add%20projects%20in%20Bulk%20.png)    |
| Edit Project                         | [Edit Project](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Edit%20Projects.png)    |
| Delete Project                       | [Delete Project  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Delete%20projects.png)    |
| Add Task                             | [Add Task  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20added.png)    |
| Edit Task                            | [Edit Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20Edit.png)    |
| Task Completed                       | [Task Completed ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Task%20Completed.png)    |
| Delete Task                          | [Delete Task   ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/delete%20task.png)    |
| Filters                              | [Filters   ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Filters.png)    |
| Sort by Due Date                     | [Sort by Due Date  ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Sort%20by%20due%20date.png)    |
| Progress Tracker                     | [Progress Tracker ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Progress%20bar.png)    |
| Smart Scheduler                      | [Smart Scheduler ](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Smart%20Scheduler.png)    |
| Duplicate Tasks Finder               | [Duplicate Tasks Finder](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Smart%20Scheduler%20duplicate%20tasks%20finder.png)    |
| Help Desk                            | [Help Desk](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Help%20desk.png)    |
| Responsive (All Devices)             | [Responsive (All Devices)](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/1a1a1cbd8f0f6022686c36b9e97483cfcc5657bd/mini-project-manager/Screenshot%20of%20the%20App/Responsive%20for%20all%20devices.png)    |

> Place the image links above using your files from `mini-project-manager/Screenshot of the App/` with the same names:
> - `Welcome Screen light mode.png`
> - `Welcome screen dark mode .png`
> - `login.png`
> - `signup.png`
> - `navbar .png`
> - `Projects created.png`
> - `Create Projects Manually.png`
> - `Add projects in Bulk .png`
> - `Edit Projects.png`
> - `Delete projects.png`
> - `Task added.png`
> - `Task Edit.png`
> - `Task Completed.png`
> - `delete task.png`
> - `Filters.png`
> - `Sort by due date.png`
> - `Progress bar.png`
> - `Smart Scheduler.png`
> - `Smart Scheduler duplicate tasks finder.png`
> - `Help desk.png`
> - `Responsive for all devices.png`

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

# PlanCraft – Mini Project Manager

A responsive full‑stack mini project manager with JWT auth, clean UI and several enhancements to impress reviewers.


---

## 🔗 Deployment Details

- **Live App (Integrated):** [https://miniprojectmanager.vercel.app/](https://miniprojectmanager.vercel.app/ )

## 🔗 Frontend and Backend Deployed Link
- **Vercel (Frontend):** `https://miniprojectmanager.vercel.app/` 
- Render (Backend): ` https://mini-project-manager-7fsq.onrender.com ` 

---


## Table of Contents
- Overview
- Screenshots
- Features (Required)
- Extra Add‑Ons
- Tech Stack
- API Endpoints
- Getting Started
- Env Vars
- Deployment Notes

## Overview
Plan and track projects and tasks. Backend: .NET 8 Web API. Frontend: React + TypeScript + Tailwind. Authentication via JWT.

## Screenshots
Add images into `screenshots/` and reference here:
- Welcome: `screenshots/welcome.png`
- Auth (Login/Register): `screenshots/auth.png`
- Dashboard: `screenshots/dashboard.png`
- Project + Scheduler: `screenshots/project-details.png`

## Features (Required)
- Auth: Register, Login (JWT). Users only see their own data
- Projects: Create, list (Dashboard), view by id, delete
- Project fields: title (3–100), optional description, createdAt
- Tasks: add, toggle completion, delete; optional due date
- Frontend pages: Welcome, Login, Register, Dashboard, Project Details
- Form validation, error handling, JWT storage & usage, React Router

## Extra Add‑Ons
- Smart Scheduler API: `POST /api/v1/projects/{projectId}/schedule`
  - Returns `recommendedOrder` for tasks using topo sort with due/effort tie‑breakers
  - Uses current tasks; duplicate task titles are rejected with a clear error
- Design System: Button, Input, Card, Badge, Modal, Skeleton; light/dark themes
- Dashboard: search, insights (Total/This week/Today), bulk add, export JSON, inline title edit with duplicate protection
- Project page: progress bar, filters (All/Active/Completed), search, sort by Due/Created, overdue/soon badges, confirmations
- UX: responsive sidebar shell, Help modal (red icon), keyboard shortcuts (g d → Dashboard, g w → Welcome)

## Tech Stack
- Backend: .NET 8 Web API (C#)
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide
- Auth: JWT (Bearer)

## API Endpoints
Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

Projects
- GET `/api/projects`
- POST `/api/projects`
- GET `/api/projects/{id}`
- DELETE `/api/projects/{id}`
- POST `/api/projects/bulk` (extra)
- GET `/api/projects/stats` (extra)

Tasks
- POST `/api/projects/{projectId}/tasks`
- PUT `/api/tasks/{taskId}`
- DELETE `/api/tasks/{taskId}`

Smart Scheduler (extra)
- POST `/api/v1/projects/{projectId}/schedule`
- Input: `{ "tasks": [{ "title": string, "estimatedHours"?: number, "dueDate"?: string, "dependencies"?: string[] }] }`
- Output: `{ "recommendedOrder": string[] }`

## Getting Started
Backend 
```bash
cd backend
dotnet restore
dotnet run   # http://localhost:5000
```

Frontend 
```bash
cd frontend
npm install
# optional: echo VITE_API_BASE=http://localhost:5000 > .env.local
npm run dev  # http://localhost:5173
```

Login flow: Register → redirected to Login (success banner) → Login → Dashboard.

## Env Vars Local
Frontend `.env.local`
- `VITE_API_BASE` (default http://localhost:5000)

## Deployment Notes

### Live Demo Links
- Final Deployment Link : https://miniprojectmanager.vercel.app/ 
- Backend (Render): https://mini-project-manager-7fsq.onrender.com 
- Frontend (Vercel): https://miniprojectmanager.vercel.app/ 

### Steps
1) Deploy backend on Render
   - Create a Web Service from the `backend/` folder
   - Runtime: .NET 8; Start command: `dotnet backend.dll` (Render will infer from `dotnet run` too)
   - Expose port 5000 (Render auto-detects); enable CORS to your frontend’s domain
2) Deploy frontend on Vercel
   - Import the repo, select `frontend/` as the project directory
   - Build Command: `npm run build`, Output: `dist`
   - Environment Variable: `VITE_API_BASE` → https://mini-project-manager-7fsq.onrender.com 
3) Post‑deploy
   - Verify `GET /api/projects` works with Authorization header locally and from the deployed frontend
   - Update the Live Demo links above

---
## Author

**Developed by:** Manav Rai  
**Institution:** Punjab Engineering College, Chandigarh  
**Email:** [manavrai454@gmail.com](mailto:manavrai454@gmail.com)  
**GitHub:** [github.com/manavrai454](https://github.com/coderiders22/)

---

## License

© 2025 **Manav Rai**. All rights reserved.

---


