import React from 'react';

export const Logo = ({ size = 28, showText = true, textColor = '#00594C' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Left House Half (Solid Teal) */}
        <path
          d="M47 16L18 38.5C15 40.8 13 44.5 13 48.5V81C13 85.4 16.6 89 21 89H47V16Z"
          fill="#00594C"
        />
        {/* Door cutout in Left Half */}
        <path
          d="M26 89V67C26 64.8 27.8 63 30 63H36C38.2 63 40 64.8 40 67V89H26Z"
          fill="white"
        />

        {/* Right House Half (Teal Outline, White fill) */}
        <path
          d="M53 16L82 38.5C85 40.8 87 44.5 87 48.5V81C87 85.4 83.4 89 79 89H53V16Z"
          fill="white"
          stroke="#00594C"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Window cutout in Right Half */}
        <rect
          x="63"
          y="56"
          width="13"
          height="14"
          rx="3.5"
          fill="#00594C"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: `${size * 0.75}px`,
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}
        >
          RoomSplit
        </span>
      )}
    </div>
  );
};
