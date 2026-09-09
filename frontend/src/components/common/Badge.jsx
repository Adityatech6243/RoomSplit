import React from 'react';

export const Badge = ({ variant = 'member', children, className = '' }) => {
  const variantClass = {
    admin: 'badge-admin',
    member: 'badge-member',
    positive: 'badge-positive',
    negative: 'badge-negative',
    warning: 'badge-warning'
  }[variant] || 'badge-member';

  return <span className={`badge ${variantClass} ${className}`}>{children}</span>;
};

export const CategoryBadge = ({ category }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.6rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}
    >
      {category}
    </span>
  );
};
