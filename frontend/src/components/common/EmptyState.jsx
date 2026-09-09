import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.875rem'
      }}
    >
      {Icon && (
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.25rem'
          }}
        >
          <Icon size={26} />
        </div>
      )}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '380px' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div style={{ marginTop: '0.5rem' }}>
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
