# StudentHub — College/University Student Portal

A semester-long web portal that gives students, faculty, and admins a single place to manage courses, attendance, grades, timetables, assignments, notifications, and fees.

## 1. Problem scope

Most colleges scatter student-facing information across notice boards, spreadsheets, and disconnected tools — attendance in one register, grades in another system, timetable changes announced only in class. StudentHub consolidates these into one role-based web portal so that:

- **Students** can check attendance, grades, timetable, and assignments without chasing staff.
- **Faculty** can mark attendance, upload grades, and post announcements from one dashboard.
- **Admins** can manage user accounts, courses, and platform-wide data.

Out of scope for this semester project: payment gateway integration (fee page is a UI mockup only), native mobile apps, and real-time chat.

## 2. User roles

| Role | Access |
|---|---|
| Student | View own courses, attendance, grades, timetable, assignments, notifications, profile, fee status |
| Faculty | Mark attendance, enter grades, manage assigned courses, post announcements |
| Admin | Manage users, courses, and platform settings; view system-wide reports |

## 3. Key modules

1. Authentication (Register / Login / Forgot Password / role-based redirect)
2. Dashboard (role-specific summary view)
3. Course management
4. Attendance tracking
5. Grades / results
6. Timetable
7. Assignments
8. Notifications / announcements
9. Library (catalog view)
10. Fee payment (status + mock checkout)
11. Profile & settings
12. Contact / support

## 4. Navigation flow

```
Home → Register / Login → Forgot Password (if needed)
              ↓
     Role-based Dashboard
              ↓
  Courses · Attendance · Grades · Timetable · Assignments
              ↓
      Notifications · Library · Fee Payment · Profile · Contact
```

See `docs/sitemap.md` for the full page tree.

## 5. Pages (minimum 10)

1. Home / landing
2. Register
3. Login
4. Forgot password
5. Dashboard (renders differently per role: student / faculty / admin)
6. Courses
7. Attendance
8. Grades
9. Timetable
10. Assignments
11. Notifications
12. Library
13. Fee payment
14. Profile / settings
15. Contact / support

## 6. Project structure

A flat, single-contributor-friendly layout — pages live in one folder instead of being split by role. Role access is handled inside each page/route with a permission check, not by folder location.

```
studenthub/
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/          Home, Register, Login, ForgotPassword,
│       │                   Dashboard, Courses, Attendance, Grades,
│       │                   Timetable, Assignments, Profile, Notifications,
│       │                   Library, FeePayment, Contact
│       ├── components/     Navbar, Sidebar, Card, Table, ProtectedRoute
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── routes/              auth.js, courses.js, attendance.js, grades.js
│   ├── controllers/         authController.js, courseController.js
│   ├── models/               User.js, Course.js, Attendance.js, Grade.js
│   ├── middleware/           authMiddleware.js
│   └── server.js
│
├── docs/
│   └── sitemap.md
│
├── .gitignore
└── README.md
```

## 7. Tech stack (suggested)

- Frontend: React + React Router, plain CSS or Tailwind
- Backend: Node.js + Express
- Database: MongoDB (or MySQL/PostgreSQL if relational is preferred)
- Auth: JWT-based sessions with role claims, checked in `ProtectedRoute` and `authMiddleware.js`

## 8. Getting started

```bash
# frontend
cd frontend
npm install
npm run dev

# backend
cd backend
npm install
npm run dev
```

## 9. Pushing to GitHub

This folder can be initialized as a git repo and pushed:

```bash
cd studenthub
git init
git add -A
git commit -m "Initial scaffold"
git remote add origin https://github.com/<your-username>/studenthub.git
git branch -M main
git push -u origin main
```
