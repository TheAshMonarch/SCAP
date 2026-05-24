'use client';

import { useRouter } from 'next/navigation';
import { AuthView } from '@/components/AuthView';
import { ToastContainer, useToast } from '@/components/Toast';

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

export default function AuthPage() {
  const { toasts, addToast, removeToast } = useToast();
  const router = useRouter();

  const handleAuth = (userData: User) => {
    addToast('success', `Welcome, ${userData.firstName}!`);
    router.push('/dashboard');
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #6366f1;
          --secondary: #8b5cf6;
          --accent: #06b6d4;
          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --muted: #6b7280;
          --bg: #f8fafc;
          --card: #ffffff;
          --border: #e5e7eb;
          --text: #111827;
          --transition: all 0.2s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: #5855eb;
        }

        .btn-secondary {
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--border);
        }

        .auth-wrap {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .auth-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
        }

        .auth-glow-1 {
          width: 300px;
          height: 300px;
          background: var(--accent);
          top: -150px;
          left: -150px;
        }

        .auth-glow-2 {
          width: 400px;
          height: 400px;
          background: var(--success);
          bottom: -200px;
          right: -200px;
        }

        .auth-left {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .brand-icon {
          font-size: 48px;
        }

        .brand-name {
          font-size: 32px;
          font-weight: bold;
        }

        .auth-title {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .auth-subtitle {
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .auth-features {
          display: flex;
          gap: 24px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          font-size: 24px;
        }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .auth-card {
          background: var(--card);
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .auth-card h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .auth-card p {
          color: var(--muted);
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 16px;
        }

        .error {
          color: var(--error);
          margin-bottom: 16px;
          font-size: 14px;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          margin-top: 16px;
          display: block;
        }

        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .toast {
          background: var(--card);
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          border-left: 4px solid var(--primary);
        }

        .toast.success {
          border-left-color: var(--success);
        }

        .toast.error {
          border-left-color: var(--error);
        }

        .toast.info {
          border-left-color: var(--accent);
        }
      `}</style>

      <ToastContainer toasts={toasts} remove={removeToast} />
      <AuthView onAuth={handleAuth} />
    </>
  );
}