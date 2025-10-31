# TaskForge – Smart Tasks Management App

**A modern, full-stack task management system built using .NET (C#) and React + TypeScript with Tailwind CSS.**
TaskForge empowers users to plan, track, and complete their tasks efficiently — all inside a sleek, animated, and intelligent productivity dashboard.

---

## 🔗 Deployment Details

- **Live App (Integrated):** [https://basictaskmanager.vercel.app/](https://basictaskmanager.vercel.app/)

## 🔗 Frontend and Backend Deployed Link
- **Vercel (Frontend):** `https://basictaskmanager.vercel.app/` 
- Render (Backend): `https://basic-task-manager-9f0x.onrender.com` 

---

## Overview

**TaskForge** is designed to demonstrate clean software architecture, interactivity, and modern frontend design principles.
It integrates a **.NET RESTful backend** with a fully dynamic **React + TypeScript** frontend featuring persistence, animations, and real-time feedback.

### Core Capabilities

- Add, edit, delete, and toggle tasks
- Track task progress with visual indicators
- Use due dates to automatically highlight overdue tasks
- Switch between light and dark themes
- Export and import your entire workspace as JSON backups
- Experience a modern onboarding screen with animations and interactive UI

---

## My Key Contributions (What I Implemented)

### Backend (.NET – C#)

- Developed a **Task API** with REST endpoints for:
  - `GET /api/tasks` → Fetch all tasks
  - `POST /api/tasks` → Add new task
  - `PUT /api/tasks/{id}` → Toggle completion
  - `DELETE /api/tasks/{id}` → Delete task
- Configured **CORS policy** for React integration
- Enabled **Swagger UI** for endpoint testing
- Designed clean, modular files:
  - `Models/TaskItem.cs` (Model)
  - `Controllers/TasksController.cs` (Controller)
  - `Program.cs` (Startup Configuration)

---

### Frontend (React + TypeScript)

I personally implemented the entire frontend from scratch using React, TypeScript, and Tailwind CSS. Below are the **key interactive and advanced features** I built:

#### Core Task Features

- **Add Tasks** — Title (required), Notes/Description (optional), and Due Date (optional)
- **Edit Tasks** — Modify title, notes, and due date inline with smooth animations
- **Delete Tasks** — One-click removal with animated confirmation
- **Toggle Completion** — Mark tasks as done/undone with live progress updates
- **Overdue Detection** — Tasks automatically flagged as “Overdue” if past their due date

#### Design & UI Features

- **Fully animated welcome/onboarding screen** explaining features using Framer Motion
- **Gradient-themed dark and light modes** with persistent state in localStorage
- **Glassmorphism UI** with rounded cards, blur effects, and layered gradients
- **Lucide React icons** for consistent professional visuals
- **Framer Motion animations** for:
  - Page transitions
  - Notifications
  - Button hovers
  - Background elements (floating gradients)

#### Productivity & Visualization

- **Dynamic progress tracking bar**
  - Shows percentage of tasks completed
  - Animates automatically on every change
- **Task filters:**
  - `All`, `Active`, `Completed`, `Overdue`
  - Filters update live with transitions

#### Data Management & Storage

- **Auto Save:** All data saved to browser `localStorage` in structured JSON format.
- **Export / Import:**
  - Export all tasks, filter, and theme as a `.json` backup file
  - Import the same JSON to restore workspace
- **Auto recovery:** Legacy task formats are automatically migrated to new schema
- **Version-safe localStorage keys (`_v1`)** for compatibility

#### otifications System

- Built a **center-screen animated notification manager** for all actions:
  - Create Task
  - Update/Edit Task
  - Delete Task
  - Overdue Alert
  - Error (e.g. Missing title input)
- Custom emoji + color-coded designs for each notification type

#### Help & Usability

- Added **Help Modal (Quick Guide)** accessible anytime
- Added tooltips on every button for clarity
- Designed **keyboard shortcuts:**
  - `Enter` → Add / Save task
  - `Escape` → Cancel edit

#### Visual Enhancements

- Animated gradient background with slow movement
- Floating glass orbs for subtle depth
- Micro-animations on icons and cards for interactivity
- Responsive layout (desktop, tablet, mobile)

#### Miscellaneous

- Built a **persistent theme manager** synced via localStorage
- Added **error handling** with user-friendly feedback
- Optimized component rendering using React Hooks (`useEffect`, `useCallback`, `useRef`)
- Modularized save/load logic for scalability

---

## Tech Stack

| Layer           | Technology                                  | Purpose                                  |
| --------------- | ------------------------------------------- | ---------------------------------------- |
| **Frontend**    | React + TypeScript                          | SPA for task management                  |
| **Backend**     | .NET (C#)                                    | RESTful API                              |
| **UI Library**  | Tailwind CSS + Framer Motion + Lucide Icons | Modern animated UI                       |
| **Storage**     | LocalStorage + JSON                         | Persistent client-side storage           |
| **HTTP Client** | Axios / Fetch API                           | Communication between frontend & backend |
| **Docs**        | Swagger UI + Markdown                       | Testing & documentation                  |

---

## ⚙️ Setup Instructions

### Clone Repository

```bash
git clone https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025.git
cd "PLC-Home-Coding-assignment-Oct-2025/Task Manager App"
```

### 🖥️ Backend Setup (.NET)

```bash
cd backend
_dotnet restore_
_dotnet run_
```

- Default launch will print the HTTP URL in the console (commonly `http://localhost:5000` or `http://localhost:5228`).

### 💻 Frontend Setup (React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

- Runs on → `http://localhost:5173` (by default)
- If your frontend calls the backend, set `VITE_API_BASE_URL` in a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🌐 API Endpoints

| Endpoint          | Method | Description       |
| ----------------- | ------ | ----------------- |
| `/api/tasks`      | GET    | Fetch all tasks   |
| `/api/tasks`      | POST   | Add new task      |
| `/api/tasks/{id}` | PUT    | Toggle completion |
| `/api/tasks/{id}` | DELETE | Delete task       |

**Example:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Finish assignment"}'
```

---

## 🚀 Deployment

- **Frontend (Vercel):**
  - Build command: `npm run build`
  - Publish directory: `frontend/build`
  

- **Backend (Render):**
  - Build & run: `dotnet publish -c Release`
  - Expose the generated executable or `TaskManagerAPI.dll`
  - Enable CORS for the frontend origin

- Once both are deployed, update the link in the **Live Demo** section:
  - Final Deployment Link: `https://basictaskmanager.vercel.app/` 
  - Vercel (Frontend): `https://basictaskmanager.vercel.app/` 
  - Render (Backend): `https://basic-task-manager-9f0x.onrender.com` 

---

## Features Summary

| Category            | Features                                                    |
| ------------------- | ----------------------------------------------------------- |
| **Core**         | Add, Edit, Delete, Toggle tasks                             |
| **Organization** | Task Filters (All / Active / Completed / Overdue)           |
| **Tracking**     | Due dates, overdue highlights, progress bar                 |
| **Design**       | Gradient UI, dark/light mode, responsive layout             |
| **Feedback**     | Animated notifications for all actions                      |
| **Persistence**  | LocalStorage JSON + Export/Import backups                   |
| **Help System**  | Interactive onboarding + Help modal                         |
| **Animations**   | Framer Motion transitions, hover effects, dynamic gradients |
| **Usability**    | Tooltips, keyboard shortcuts, inline edit mode              |

---

## Architecture Summary

- **Frontend:** React SPA using Hooks, TypeScript types, and modular design. Handles UI state, user actions, and persistent storage.
- **Backend:** .NET Web API serving as REST interface for CRUD operations. Uses in-memory storage for simplicity (can be extended to a DB easily).
- **Persistence Layer:** LocalStorage-based data model (`task_{id}_v1`) with schema versioning.
- **Communication:** JSON over HTTP with Axios.
- **UX Flow:** 1) Welcome Screen → 2) Dashboard → 3) Add/Edit/Delete Tasks → 4) Track Progress → 5) Export Backup.

---

## Screenshots (Demo)

| Screen              | Preview                                      |
| ------------------- | -------------------------------------------- |
| Welcome Screen      | ![Welcome](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Welcome%20screen.png)|
| Dashboard           | ![Dashboard](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Dashborard.png) |
| Help Box            | ![Help Box](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Help%20box.png)  |
| Add Task            | ![Add Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Task%20Added.png)   |
| Task Completion     | ![Task Completion](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Task%20Completed.png)|
| Edit Task           | ![Edit Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/edit%20the%20task.png)   |
| Delete Task         | ![Delete Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/48cc2865aa138ab8eb268d4a1ef540c239a526c9/Task%20Manager%20App/Screenshot%20of%20the%20app/delete.png)   |
| Import Task(json)   | ![Import Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Import%20the%20task%20in%20dashboard.png)   |
| Export Task(json)   | ![Export Task](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/Export%20the%20task%20in%20json.png)   |
| Dark Mode           | ![Dark Mode](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/dark%20mode.png)  |
| Light Mode          | ![Light Mode](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/2ccf899f65e1253010cfb1d691996bc6bf644067/Task%20Manager%20App/Screenshot%20of%20the%20app/light%20mode.png) |
| Filters             | ![Filters](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/f0650eed6aa2d97e442cd218db66e41e79dc9d92/Task%20Manager%20App/Screenshot%20of%20the%20app/filters.png)     |
| Progress Tracker    | ![Progress](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/blob/b3e223a198523ff01dc2d1c1f8d477f3ec03da2d/Task%20Manager%20App/Screenshot%20of%20the%20app/progress%20bar.png)   |

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
