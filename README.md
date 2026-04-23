# 🎓 EduTrack — Student Management System

## Project Structure
```
student-management-system/
├── index.html        ← Frontend (HTML + CSS + JS)
├── server.js         ← Backend (Node.js + Express)
├── package.json      ← Dependencies
├── .env.example      ← Environment variables template
└── README.md         ← This file
```

---

## ⚙️ Local Setup (Development)

### Step 1 — Install Node.js
Download from: https://nodejs.org (v18+)

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Setup environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

### Step 4 — Run backend
```bash
npm run dev    # development (auto-restart)
# OR
npm start      # production
```

### Step 5 — Open frontend
Just open `index.html` in your browser, or use VS Code Live Server.

---

## 🌐 Deployment Guide

### DATABASE — MongoDB Atlas (Free)

1. Go to https://cloud.mongodb.com
2. Create free account → New Project → Create Cluster (M0 Free)
3. Database Access → Add user (username + password)
4. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Connect → Drivers → Copy connection string
6. Replace `<password>` in your .env MONGODB_URI

---

### BACKEND — Render.com (Free)

1. Push your code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add Environment Variables:
   - `MONGODB_URI` = your Atlas connection string
   - `PORT` = 5000
   - `FRONTEND_URL` = your frontend URL (add after frontend deploy)
6. Deploy → Copy your Render URL (e.g. https://your-app.onrender.com)

---

### FRONTEND — Vercel (Free)

1. Update `API_BASE` in `index.html`:
   ```js
   const API_BASE = 'https://your-app.onrender.com/api';
   ```
2. Go to https://vercel.com → New Project
3. Import GitHub repo OR drag-and-drop your folder
4. Deploy → Copy Vercel URL

5. Go back to Render → Environment Variables
6. Update `FRONTEND_URL` = your Vercel URL
7. Redeploy Render

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Add new student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

### Query Params (GET /api/students)
- `?branch=CS` — filter by branch
- `?gender=M` — filter by gender
- `?search=rahul` — search by name/roll no

### POST/PUT Body
```json
{
  "name": "Rahul Sharma",
  "rollNo": "27",
  "branch": "CS",
  "gender": "M",
  "dob": "2004-05-15"
}
```

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Deployment:** Render (backend) + Vercel (frontend) + MongoDB Atlas (DB)
