import React from 'react'

export function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: '"Noto Serif", Georgia, serif',
        fontWeight: 700,
        fontSize: '1.1rem',
        color: '#4B0082',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 100 86" fill="none">
        <polygon
          points="50,2 98,27 98,60 50,85 2,60 2,27"
          stroke="#4B0082"
          strokeWidth="6"
          fill="none"
        />
        <polygon
          points="50,22 76,36 76,52 50,66 24,52 24,36"
          stroke="#4B0082"
          strokeWidth="4"
          fill="none"
        />
      </svg>
      mukoko
    </div>
  )
}

export function Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 100 86" fill="none">
      <polygon
        points="50,2 98,27 98,60 50,85 2,60 2,27"
        stroke="#4B0082"
        strokeWidth="8"
        fill="none"
      />
    </svg>
  )
}
