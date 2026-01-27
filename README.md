# SkillBridge 🚀

SkillBridge is a **full-stack learning and skill development platform** designed to help users follow structured learning paths, track progress, and bridge the gap between skills and real-world opportunities.

The platform is built using a **modern full-stack architecture**, with **React** handling the frontend UI and **Node.js + Express** powering a scalable backend API.

---

## 🎯 Project Goal

The goal of SkillBridge is to:
- Provide **structured learning roadmaps** for different skills
- Allow users to **track their progress**
- Offer a scalable foundation for future features like mentorship, assessments, and certifications

This project is being built as a **production-style full-stack application**, with a focus on clean architecture and best practices.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- JSX
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- RESTful APIs
- JWT-based Authentication
- Middleware-driven architecture

### Database
- (Planned) PostgreSQL / MongoDB

---

## 🧱 Architecture Overview

SkillBridge follows a **separation of concerns** approach:

- **Frontend** is responsible for UI, routing, and user interaction
- **Backend** exposes REST APIs for authentication, business logic, and data handling
- **Database** stores users, skills, roadmaps, and progress data

The backend does **not render UI**, and the frontend does **not access the database directly**.
