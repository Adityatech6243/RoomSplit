import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '2rem' }}>
        The page or room resource you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" icon={Home} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
};
