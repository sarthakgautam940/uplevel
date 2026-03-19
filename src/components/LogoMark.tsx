"use client";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 36, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-mark ${className}`}
    >
      {/* Background panel */}
      <rect width="100" height="100" rx="6" fill="#162030" />

      {/* Main white shape — angular bookmark/arrow */}
      <path
        d="M18 12 L62 12 L80 30 L80 88 L50 88 L18 62 Z"
        fill="white"
        opacity="0.95"
      />

      {/* Teal accent notch — bottom right corner detail */}
      <path
        d="M62 12 L80 30 L62 30 Z"
        fill="#2FBFAD"
        opacity="0.9"
      />

      {/* Inner step detail */}
      <path
        d="M50 70 L50 88 L38 78 Z"
        fill="#2FBFAD"
        opacity="0.7"
      />
    </svg>
  );
}
