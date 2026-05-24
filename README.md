# SCAP - Student Course & Attendance Platform

A full-stack application for managing student courses and attendance.

## Project Structure

- `backend/` - NestJS API server
- `frontend/` - Next.js React client

## Getting Started

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Runs on http://localhost:3000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3001

## Features

- Student authentication (register/login)
- Course enrollment
- Dashboard with stats
- Course and class management

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/profile

### Courses
- GET /course (enrolled courses for authenticated student)
- POST /course (admin only)

### Students
- POST /students/:id/enroll/:courseId
- DELETE /students/:id/unenroll/:courseId

## Tech Stack

- Backend: NestJS, MongoDB, JWT
- Frontend: Next.js, React, TypeScript