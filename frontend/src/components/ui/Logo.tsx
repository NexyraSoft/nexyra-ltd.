import React from "react";

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Horizontal Main Axis */}
      <path d="M60 200H340" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
      
      {/* Upper Neural Threads (Flowing towards top-left) */}
      <g stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M300 200 C 300 110, 220 60, 130 60" />
        <path d="M260 200 C 260 140, 210 100, 160 100" />
        <path d="M220 200 C 220 170, 200 140, 180 140" />
      </g>
      
      {/* Lower Neural Threads (Flowing towards bottom-right) */}
      <g stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M100 200 C 100 290, 180 340, 270 340" />
        <path d="M140 200 C 140 260, 190 300, 240 300" />
        <path d="M180 200 C 180 230, 200 260, 220 260" />
      </g>

      {/* Connection Nodes */}
      <g fill="currentColor">
        {/* Top Nodes */}
        <circle cx="130" cy="60" r="14" />
        <circle cx="160" cy="100" r="12" />
        <circle cx="180" cy="140" r="10" />
        
        {/* Bottom Nodes */}
        <circle cx="270" cy="340" r="14" />
        <circle cx="240" cy="300" r="12" />
        <circle cx="220" cy="260" r="10" />
        
        {/* Periphery Aesthetic Nodes */}
        <circle cx="100" cy="120" r="8" />
        <circle cx="80" cy="80" r="10" />
        <circle cx="120" cy="40" r="8" />
        <circle cx="300" cy="280" r="8" />
        <circle cx="320" cy="320" r="10" />
        <circle cx="280" cy="360" r="8" />
      </g>
    </svg>
  );
};
