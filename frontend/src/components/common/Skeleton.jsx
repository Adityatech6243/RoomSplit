import React from 'react';

export const Skeleton = ({ height = '20px', width = '100%', borderRadius = 'var(--radius-sm)', className = '' }) => {
  return (
    <div
      className={className}
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: '#e2e8f0',
        backgroundImage: 'linear-gradient(90deg, #e2e8f0 0px, #f1f5f9 50%, #e2e8f0 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s infinite ease-in-out'
      }}
    />
  );
};
