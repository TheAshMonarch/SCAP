'use client';

import { useState } from 'react';
import { api, setAccessToken } from '@/lib/api';   // Make sure these exports exist

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

interface AuthViewProps {
  onAuth: (user: User) => void;
}

export function AuthView({ onAuth }: AuthViewProps) {
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '',
    username: '', department: '', faculty: '', level: '100', 
    gpa: '0', semester: '1'
  });

  const set = (k: string, v: string) => 
    setForm(f => ({ ...f, [k]: v }));

  // ==================== LOGIN ====================
async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const data = await api.post('/auth/login', {
      email: form.email,
      password: form.password,
    });

    setAccessToken(data.access_token);

    const profile = await api.get('/auth/profile');
    onAuth(profile);
  } catch (err: any) {
    setError(err.message || 'Login failed');
    console.error(err);
  } finally {
    setLoading(false);
  }
}
  // ==================== REGISTER ====================
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        level: parseInt(form.level),
        gpa: parseFloat(form.gpa) || 0,
      };

      const data = await api.post('/auth/register', payload);

      setAccessToken(data.access_token);
      localStorage.setItem('scap_access_token', data.access_token);

      const profile = await api.get('/auth/profile');
      onAuth(profile);

    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  // ... rest of your UI stays mostly the same

  if (mode === 'landing') {
    return (
      <div className="auth-wrap bg-auth-bg bg-cover md: ">
        {/* Your existing landing UI */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
            <button className="btn btn-primary " onClick={() => setMode('login')}>
              Sign In
            </button>
            <button className="btn btn-secondary" onClick={() => setMode('register')}>
              Create Account
            </button>
          <button className="border border-gray-400 block mt-[16px] p-2 rounded-md hover:cursor-pointer hover:bg-accent-color transition duration-500 ease-in-out" onClick={() => { location.href = '/'; }}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="auth-wrap bg-auth-bg2 bg-cover">
        <div className="auth-right">
          <div className="auth-card">
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e => set('email', e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={e => set('password', e.target.value)} 
                  required 
                />
              </div>

              {error && <div className="error">{error}</div>}

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <button className="btn-link" onClick={() => setMode('register')}>
              Need an account? Register
            </button>
            <button className="btn-link" onClick={() => setMode('landing')}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Register UI (same as before, just using handleRegister)
  const steps = [
    { title: 'Basic Info', fields: ['firstName', 'lastName', 'email', 'username'] },
    { title: 'Academic Info', fields: ['department', 'faculty', 'level', 'semester'] },
    { title: 'Final Step', fields: ['password', 'gpa'] },
  ];

  return (
    <div className="auth-wrap">
      <div className="auth-right">
        <div className="auth-card">
          <h2>Register - Step {step} of 3</h2>
          <p>{steps[step-1].title}</p>
          <form onSubmit={handleRegister}>
            {steps[step-1].fields.map(field => (
              <div key={field} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field as keyof typeof form]}
                  onChange={e => set(field, e.target.value)}
                  required
                />
              </div>
            ))}
            {error && <div className="error">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {step < 3 ? 'Next' : loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <button className="btn-link" onClick={() => setMode('login')}>
            Already have an account? Sign In
          </button>
          <button className="btn-link" onClick={() => setMode('landing')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}