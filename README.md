# 🏢 Job Hub — Student Job Hub System

A full-stack job vacancy platform built with **React** (frontend) and **Django REST Framework** (backend).

---

## 📁 Project Structure

```
jobhub/
├── backend/                  # Django REST API
│   ├── apps/
│   │   ├── accounts/         # Users, authentication, profiles
│   │   ├── jobs/             # Job postings & categories
│   │   ├── applications/     # Job applications
│   │   └── messaging/        # Internal messaging
│   ├── jobhub_project/       # Django settings & URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── components/       # Reusable UI components
    │   │   ├── common/       # Navbar, ProtectedRoute
    │   │   └── jobs/         # JobCard
    │   ├── contexts/         # AuthContext (global state)
    │   ├── pages/
    │   │   ├── auth/         # Login, Register
    │   │   ├── employer/     # Dashboard, PostJob, Applications
    │   │   ├── seeker/       # Dashboard, Profile
    │   │   └── shared/       # Jobs listing, Job detail, Messages
    │   ├── services/         # api.js (Axios + JWT interceptors)
    │   └── App.jsx           # Routes
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip & npm

---

### Backend Setup

```bash
cd backend

# 1. Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your settings

# 4. Run migrations
python manage.py makemigrations accounts jobs applications messaging
python manage.py migrate

# 5. Create a superuser (for Django admin)
python manage.py createsuperuser

# 6. (Optional) Seed job categories
python manage.py shell -c "
from apps.jobs.models import JobCategory
from django.utils.text import slugify
cats = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Engineering', 'Sales', 'Design']
for name in cats:
    JobCategory.objects.get_or_create(name=name, defaults={'slug': slugify(name)})
print('Categories created!')
"

# 7. Start the development server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin**

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

> The Vite dev server proxies `/api` → `http://localhost:8000` automatically.

---

## 🔑 API Endpoints Summary

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register/` | Register (seeker or employer) |
| POST | `/api/auth/login/` | Login → JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/me/` | Current user |
| GET/PATCH | `/api/auth/seeker-profile/` | Seeker profile |
| GET/PATCH | `/api/auth/employer-profile/` | Employer profile |
| GET | `/api/jobs/` | List open jobs (public) |
| GET/POST | `/api/jobs/manage/` | Employer: list/create own jobs |
| GET/PATCH/DELETE | `/api/jobs/<id>/` | Job detail |
| GET | `/api/jobs/categories/` | Job categories |
| POST | `/api/applications/apply/` | Apply for a job |
| GET | `/api/applications/my/` | Seeker: my applications |
| GET | `/api/applications/job/<id>/` | Employer: apps for a job |
| PATCH | `/api/applications/<id>/status/` | Update application status |
| GET | `/api/messages/inbox/` | Inbox |
| GET | `/api/messages/sent/` | Sent messages |
| POST | `/api/messages/send/` | Send a message |

---

## ✅ Features Implemented

### Sprint 1 — Authentication ✅
- Role-based registration (Job Seeker / Employer)
- JWT login with auto-refresh
- Protected routes by role

### Sprint 2 — Job Posting ✅
- Employers: create, publish, save as draft
- Full CRUD via API
- Category & filter support

### Sprint 3 — Job Search ✅
- Multi-criteria search (keyword, type, category, location)
- Live filtering sidebar
- Public job listing (no login required)

### Sprint 4 — Applications ✅
- Seekers apply with cover letter
- Email notification to employer on apply
- Duplicate application prevention

### Sprint 5 — Employer Dashboard ✅
- View all posted jobs + stats
- Review applications with status updates (New → Reviewed → Contacted → Hired)

### Sprint 6 — Messaging ✅
- Internal inbox & sent messages
- Compose, reply, archive
- Unread indicators

### Sprint 7 — Seeker Profile ✅
- Bio, skills, education, experience
- LinkedIn URL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP | Axios (with JWT interceptors) |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Email | Django email (console for dev, SMTP for prod) |

---

## 👥 Group Members

- FADZAI Z MUTETWA — C24159402C
- TAVONGA KARIMANZIRA — C24160004C
- SABINA MAPFUMO — C24160469B
- ASHLEY CHIVEZA — C24160471J
- MARTHA KABWEREKE — C24158989H
- SHAMAR SOZA — C24158812O
- SHANTEL N VAMBE — C24161318L
- BLESSED MANGENA — C24158654U
- ANOTIDAISHE GUMUNYU — C24160087R
