import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  msg: string;
}

export function ToastContainer({ toasts, remove }: { toasts: Toast[], remove: (id: string) => void }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontSize: 16 }}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ color: 'var(--muted)', fontSize: 16 }}>×</button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], msg: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}