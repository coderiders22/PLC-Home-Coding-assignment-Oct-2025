# PLC Home Coding Assignment – Oct 2025

A single repository hosting two full‑stack projects built with .NET (C#) + React/TypeScript + Tailwind:

- `Task Manager App` – a modern task tracker with export/import, filters, progress bar, dark/light themes
- `mini-project-manager` – projects + tasks with JWT auth, bulk operations, stats, and a Smart Scheduler

---

## 🔗 Live Demos 

- Project Hub (Landing): [plc-project-hub.vercel.app](https://plc-project-hub.vercel.app/)
- Task Manager (Frontend): [basictaskmanager.vercel.app](https://basictaskmanager.vercel.app/)
- Mini Project Manager (Frontend): [miniprojectmanager.vercel.app](https://miniprojectmanager.vercel.app/)

Frontend apps are fully integrated with their backends. Use the links above to explore.  
Optional direct API references (for testing): 
- Task Manager (Backend): [basic-task-manager-9f0x.onrender.com](https://basic-task-manager-9f0x.onrender.com)
- Mini Project Manager (Backend): [mini-project-manager-7fsq.onrender.com](https://mini-project-manager-7fsq.onrender.com)

> If any link is down, please check the subproject READMEs for updated deployment info.

---

## 📁 Project Structure

- `Task Manager App/` → [README](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/tree/main/Task%20Manager%20App)
- `mini-project-manager/` → [README](https://github.com/coderiders22/PLC-Home-Coding-assignment-Oct-2025/tree/main/mini-project-manager)

---

## ⚙️ Quick Start (Local)

### Backend (either project)
```bash
cd "<project>/backend"
dotnet restore
dotnet run
```

### Frontend (either project)
```bash
cd "<project>/frontend"
npm install
npm run dev
```

- Default frontend dev URL: `http://localhost:5173`
- Set `VITE_API_BASE_URL` in `.env` if calling the local backend

---

## 🧱 Tech Highlights

- .NET 8/9 Web API, JWT authentication (mini project manager)
- React + TypeScript + Tailwind, modular UI with reusable components
- Smart scheduling (topological ordering + due date and effort tiebreakers)
- Clean REST endpoints with Swagger for testing

---

## 👤 Author

**Manav Rai** · Punjab Engineering College, Chandigarh  
Email: [manavrai454@gmail.com](mailto:manavrai454@gmail.com)  
GitHub: [github.com/coderiders22](https://github.com/coderiders22)

---

## 📄 License

MIT © 2025 Manav Rai
