# ⚡ TaskForge – Smart Task Management App

**A modern, full-stack task management system built using .NET 8 (C#) and React + TypeScript with Tailwind CSS.**
TaskForge empowers users to plan, track, and complete their tasks efficiently — all inside a sleek, animated, and intelligent productivity dashboard.

---

## 🧭 Overview

**TaskForge** is designed to demonstrate clean software architecture, interactivity, and modern frontend design principles.
It integrates a **.NET 8 RESTful backend** with a fully dynamic **React + TypeScript** frontend featuring persistence, animations, and real-time feedback.

### 💼 Core Capabilities

* Add, edit, delete, and toggle tasks
* Track task progress with visual indicators
* Use due dates to automatically highlight overdue tasks
* Switch between light and dark themes
* Export and import your entire workspace as JSON backups
* Experience a modern onboarding screen with animations and interactive UI

---

## 🧩 My Key Contributions (What I Implemented)

### 🧱 Backend (.NET 8 – C#)

* Developed a **Task API** with REST endpoints for:

  * `GET /api/tasks` → Fetch all tasks
  * `POST /api/tasks` → Add new task
  * `PUT /api/tasks/{id}` → Toggle completion
  * `DELETE /api/tasks/{id}` → Delete task
* Configured **CORS policy** for React integration
* Enabled **Swagger UI** for endpoint testing
* Designed clean, modular files:

  * `TaskItem.cs` (Model)
  * `TaskController.cs` (Controller)
  * `Program.cs` (Startup Configuration)

---

### 💻 Frontend (React + TypeScript)

I personally implemented the entire frontend from scratch using React, TypeScript, and Tailwind CSS.
Below are the **key interactive and advanced features** I built:

#### 🪶 Core Task Features

* **Add Tasks** — Title (required), Notes/Description (optional), and Due Date (optional)
* **Edit Tasks** — Modify title, notes, and due date inline with smooth animations
* **Delete Tasks** — One-click removal with animated confirmation
* **Toggle Completion** — Mark tasks as done/undone with live progress updates
* **Overdue Detection** — Tasks automatically flagged as “Overdue” if past their due date

#### 🎨 Design & UI Features

* **Fully animated welcome/onboarding screen** explaining features using Framer Motion
* **Gradient-themed dark and light modes** with persistent state in localStorage
* **Glassmorphism UI** with rounded cards, blur effects, and layered gradients
* **Lucide React icons** for consistent professional visuals
* **Framer Motion animations** for:

  * Page transitions
  * Notifications
  * Button hovers
  * Background elements (floating gradients)

#### 📊 Productivity & Visualization

* **Dynamic progress tracking bar**

  * Shows percentage of tasks completed
  * Animates automatically on every change
* **Task filters:**

  * `All`, `Active`, `Completed`, `Overdue`
  * Filters update live with transitions

#### 💾 Data Management & Storage

* **Auto Save:** All data saved to browser `localStorage` in structured JSON format.
* **Export / Import:**

  * Export all tasks, filter, and theme as a `.json` backup file
  * Import the same JSON to restore workspace
* **Auto recovery:** Legacy task formats are automatically migrated to new schema
* **Version-safe localStorage keys (`_v1`)** for compatibility

#### 🔔 Notifications System

* Built a **center-screen animated notification manager** for all actions:

  * 🟢 Create Task
  * 🔵 Update/Edit Task
  * 🔴 Delete Task
  * 🟡 Overdue Alert
  * ⚠️ Error (e.g. Missing title input)
* Custom emoji + color-coded designs for each notification type

#### 🧠 Help & Usability

* Added **Help Modal (Quick Guide)** accessible anytime
* Added tooltips on every button for clarity
* Designed **keyboard shortcuts:**

  * `Enter` → Add / Save task
  * `Escape` → Cancel edit

#### 🎬 Visual Enhancements

* Animated gradient background with slow movement
* Floating glass orbs for subtle depth
* Micro-animations on icons and cards for interactivity
* Responsive layout (desktop, tablet, mobile)

#### 🧾 Miscellaneous

* Built a **persistent theme manager** synced via localStorage
* Added **error handling** with user-friendly feedback
* Optimized component rendering using React Hooks (`useEffect`, `useCallback`, `useRef`)
* Modularized save/load logic for scalability

---

## 🧰 Tech Stack

| Layer           | Technology                                  | Purpose                                  |
| --------------- | ------------------------------------------- | ---------------------------------------- |
| **Frontend**    | React + TypeScript                          | SPA for task management                  |
| **Backend**     | .NET 8 (C#)                                 | RESTful API                              |
| **UI Library**  | Tailwind CSS + Framer Motion + Lucide Icons | Modern animated UI                       |
| **Storage**     | LocalStorage + JSON                         | Persistent client-side storage           |
| **HTTP Client** | Axios / Fetch API                           | Communication between frontend & backend |
| **Docs**        | Swagger UI + Markdown                       | Testing & documentation                  |

---

## ⚙️ Setup Instructions

### 🧱 Clone Repository

```bash
git clone https://github.com/your-username/taskforge.git
cd taskforge
```

### 🖥️ Backend Setup (.NET 8)

```bash
cd TaskManagerAPI
dotnet restore
dotnet run
```

Runs on → `http://localhost:5000`

### 💻 Frontend Setup (React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Runs on → `http://localhost:5173`

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

## 🧮 Features Summary

| Category            | Features                                                    |
| ------------------- | ----------------------------------------------------------- |
| 🧩 **Core**         | Add, Edit, Delete, Toggle tasks                             |
| 🧭 **Organization** | Task Filters (All / Active / Completed / Overdue)           |
| 🕒 **Tracking**     | Due dates, overdue highlights, progress bar                 |
| 🎨 **Design**       | Gradient UI, dark/light mode, responsive layout             |
| 🔔 **Feedback**     | Animated notifications for all actions                      |
| 💾 **Persistence**  | LocalStorage JSON + Export/Import backups                   |
| 💬 **Help System**  | Interactive onboarding + Help modal                         |
| 🪄 **Animations**   | Framer Motion transitions, hover effects, dynamic gradients |
| 🧠 **Usability**    | Tooltips, keyboard shortcuts, inline edit mode              |

---

## 🧱 Architecture Summary

* **Frontend:**
  React SPA using Hooks, TypeScript types, and modular design.
  Handles UI state, user actions, and persistent storage.

* **Backend:**
  .NET 8 Web API serving as REST interface for CRUD operations.
  Uses in-memory storage for simplicity (can be extended to a DB easily).

* **Persistence Layer:**
  LocalStorage-based data model (`task_{id}_v1`) with schema versioning.

* **Communication:**
  JSON over HTTP with Axios.

* **UX Flow:**

  1. Welcome Screen → 2. Dashboard → 3. Add/Edit/Delete Tasks → 4. Track Progress → 5. Export Backup.

---

## 🖼️ Screenshots (Demo)

| Screen              | Preview                                      |
| ------------------- | -------------------------------------------- |
| 🏠 Welcome Screen   | ![Welcome](docs/screenshots/welcome.png)     |
| 📋 Dashboard        | ![Dashboard](docs/screenshots/dashboard.png) |
| ✍️ Add Task         | ![Add Task](docs/screenshots/add-task.png)   |
| 🌗 Dark Mode        | ![Dark Mode](docs/screenshots/darkmode.png)  |
| 🔍 Filters          | ![Filters](docs/screenshots/filters.png)     |
| 📈 Progress Tracker | ![Progress](docs/screenshots/progress.png)   |

---

## 👨‍💻 Author

**Developed by:** Manav Rai
**Institution:** Punjab Engineering College, Chandigarh
**Email:** [manavrai454@gmail.com](mailto:manavrai454@gmail.com)
**GitHub:** [github.com/manavrai454](https://github.com/manavrai454)

---

## 📜 License

Released under the **MIT License**
© 2025 **Manav Rai**. All rights reserved.

---
