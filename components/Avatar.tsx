import React, { useMemo } from 'react';

// A simple deterministic hash function to map a string to a number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Configuration options
const SKIN_COLORS = ["#ffffff"];
const HAIR_COLORS = ["#000000"];
const HAIR_STYLES = ['short', 'long', 'afro', 'mohawk', 'bald'];
const ACCESSORIES = ['none', 'glasses', 'sunglasses', 'earrings'];
const BG_COLORS = ["#f4f4f5", "#ffffff", "#e4e4e7"];

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function AvatarSVG({ name, size = 40, className = '' }: AvatarProps) {
  const config = useMemo(() => {
    const hash = hashString(name);
    return {
      skin: SKIN_COLORS[hash % SKIN_COLORS.length],
      hair: HAIR_COLORS[(hash >> 1) % HAIR_COLORS.length],
      hairStyle: HAIR_STYLES[(hash >> 2) % HAIR_STYLES.length],
      accessory: ACCESSORIES[(hash >> 3) % ACCESSORIES.length],
      bg: BG_COLORS[(hash >> 4) % BG_COLORS.length],
    };
  }, [name]);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full overflow-hidden ${className}`}
      style={{ borderRadius: '50%', background: config.bg, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Base Face */}
      <circle cx="50" cy="65" r="30" fill={config.skin} />
      <path d="M 35 65 Q 50 85 65 65" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
      
      {/* Eyes */}
      <circle cx="40" cy="55" r="4" fill="#080810" />
      <circle cx="60" cy="55" r="4" fill="#080810" />

      {/* Hair Styles */}
      {config.hairStyle === 'short' && (
        <path d="M 20 50 Q 50 10 80 50 L 80 40 Q 50 5 20 40 Z" fill={config.hair} />
      )}
      {config.hairStyle === 'long' && (
        <path d="M 15 70 Q 20 20 50 10 Q 80 20 85 70 Q 75 80 70 60 Q 50 30 30 60 Q 25 80 15 70" fill={config.hair} />
      )}
      {config.hairStyle === 'afro' && (
        <circle cx="50" cy="35" r="30" fill={config.hair} opacity="0.95" />
      )}
      {config.hairStyle === 'mohawk' && (
        <path d="M 40 40 L 45 5 L 55 5 L 60 40 Z" fill={config.hair} />
      )}
      
      {/* Accessories */}
      {config.accessory === 'glasses' && (
        <g stroke="#222" strokeWidth="2" fill="none">
          <rect x="30" y="50" width="16" height="10" rx="2" />
          <rect x="54" y="50" width="16" height="10" rx="2" />
          <line x1="46" y1="55" x2="54" y2="55" />
        </g>
      )}
      {config.accessory === 'sunglasses' && (
        <g stroke="#111" strokeWidth="1" fill="#111">
          <rect x="30" y="50" width="16" height="10" rx="2" />
          <rect x="54" y="50" width="16" height="10" rx="2" />
          <line x1="46" y1="55" x2="54" y2="55" strokeWidth="3" />
        </g>
      )}
      {config.accessory === 'earrings' && (
        <g fill="#000000">
          <circle cx="20" cy="65" r="3" />
          <circle cx="80" cy="65" r="3" />
        </g>
      )}
    </svg>
  );
}
