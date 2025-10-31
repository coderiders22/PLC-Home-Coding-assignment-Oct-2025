# PlanCraft – Mini Project Manager

A responsive full‑stack mini project manager with JWT auth, clean UI and several enhancements to impress reviewers.

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

## Env Vars
Frontend `.env.local`
- `VITE_API_BASE` (default http://localhost:5000)

## Deployment Notes

### Live Demo Links
- Deployment Link : https://your-vercel-frontend.vercel.app  
- Backend (Render): https://mini-project-manager-7fsq.onrender.com 
- Frontend (Vercel): https://your-vercel-frontend.vercel.app  

### Steps
1) Deploy backend on Render
   - Create a Web Service from the `backend/` folder
   - Runtime: .NET 8; Start command: `dotnet backend.dll` (Render will infer from `dotnet run` too)
   - Expose port 5000 (Render auto-detects); enable CORS to your frontend’s domain
2) Deploy frontend on Vercel
   - Import the repo, select `frontend/` as the project directory
   - Build Command: `npm run build`, Output: `dist`
   - Environment Variable: `VITE_API_BASE` → your Render backend URL
3) Post‑deploy
   - Verify `GET /api/projects` works with Authorization header locally and from the deployed frontend
   - Update the Live Demo links above

---
Developed by Manav Rai. Add screenshots under `screenshots/` and link them above.


