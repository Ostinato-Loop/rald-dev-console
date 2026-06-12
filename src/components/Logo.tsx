// RALD Dev Console — Logo
// LILCKY STUDIO LIMITED

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <path d="M8 8h7a5 5 0 0 1 0 10H8V8Z" fill="white" fillOpacity="0.95" />
      <path d="M15 18l5 6h-4l-5-6" fill="white" fillOpacity="0.7" />
      <circle cx="24" cy="8" r="3" fill="white" fillOpacity="0.9" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FF88" />
          <stop offset="1" stopColor="#0066FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
