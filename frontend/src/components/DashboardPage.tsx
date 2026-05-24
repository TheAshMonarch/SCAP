'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  department: string;
  faculty: string;
  level: number;
  semester: number;
  gpa: number;
  enrolledCourses: any[];
}

interface Course {
  _id: string;
  courseCode: string;
  title: string;
  credits: number;
  faculty: string;
  department: string;
}

interface Class {
  _id: string;
  course: Course;
  schedule: string;
  room: string;
  instructor: string;
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/course?limit=5').catch(() => ({ data: [] })),
      api.get('/classes?limit=8').catch(() => ({ data: [] })),
    ]).then(([c, cl]) => {
      setCourses(Array.isArray(c) ? c : (c.data || []));
      setClasses(Array.isArray(cl) ? cl : (cl.data || []));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.firstName}!</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{user.enrolledCourses?.length || 0}</div>
            <div className="stat-label">Courses Enrolled</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{classes.length}</div>
            <div className="stat-label">Classes This Week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{user.gpa}</div>
            <div className="stat-label">Current GPA</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{user.semester}</div>
            <div className="stat-label">Current Semester</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Recent Courses</h2>
          <div className="courses-list">
            {courses.slice(0, 4).map(course => (
              <div key={course._id} className="course-card">
                <div className="course-icon course-icon-1">{course.courseCode.slice(0, 2)}</div>
                <div className="course-info">
                  <div className="course-title">{course.title}</div>
                  <div className="course-code">{course.courseCode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Upcoming Classes</h2>
          <div className="classes-list">
            {classes.slice(0, 4).map(cls => (
              <div key={cls._id} className="class-card">
                <div className="class-info">
                  <div className="class-title">{cls.course.title}</div>
                  <div className="class-schedule">{cls.schedule}</div>
                </div>
                <div className="class-room">{cls.room}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}