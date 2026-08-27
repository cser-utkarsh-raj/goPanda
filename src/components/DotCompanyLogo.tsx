import React from 'react';

interface DotCompanyLogoProps {
  size?: number | string;
  variant?: 'icon' | 'badge' | 'full';
  className?: string;
}

export const DotCompanyLogo: React.FC<DotCompanyLogoProps> = ({
  size = 32,
  variant = 'badge',
  className = '',
}) => {
  if (variant === 'icon') {
    // Compact mascot head + wave icon (great for small badges and buttons)
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`overflow-visible drop-shadow-sm select-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Emblem Accent */}
        <path
          d="M 16,36 L 16,84 L 84,84 L 84,36 L 50,18 Z"
          fill="#14B8A6"
          stroke="#09090B"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M 24,42 L 24,76 L 76,76 L 76,42 L 50,28 Z"
          fill="#8B5CF6"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Waving Arm (Purple Robot Hand) */}
        <g>
          {/* Upper Arm */}
          <path
            d="M 68,54 L 86,40 L 92,48 L 74,62 Z"
            fill="#A78BFA"
            stroke="#09090B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hand Palm */}
          <rect
            x="84"
            y="32"
            width="14"
            height="14"
            rx="3"
            fill="#8B5CF6"
            stroke="#09090B"
            strokeWidth="3"
            transform="rotate(15 84 32)"
          />
          {/* Fingers */}
          <line x1="88" y1="30" x2="88" y2="24" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
          <line x1="93" y1="31" x2="95" y2="25" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
          <line x1="98" y1="34" x2="102" y2="29" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Left Hand Arm */}
        <g>
          <path
            d="M 28,58 L 14,68 L 18,80 L 32,68 Z"
            fill="#A78BFA"
            stroke="#09090B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hand */}
          <rect
            x="10"
            y="74"
            width="12"
            height="14"
            rx="3"
            fill="#8B5CF6"
            stroke="#09090B"
            strokeWidth="3"
          />
        </g>

        {/* Mascot Turquoise Circle Body */}
        <circle
          cx="50"
          cy="56"
          r="26"
          fill="#14B8A6"
          stroke="#09090B"
          strokeWidth="4"
        />

        {/* Cute Face (Eyes + Smile) */}
        {/* Left Eye */}
        <ellipse cx="42" cy="54" rx="3" ry="3.5" fill="#09090B" />
        <circle cx="43" cy="53" r="1" fill="#FFFFFF" />
        {/* Right Eye */}
        <ellipse cx="58" cy="54" rx="3" ry="3.5" fill="#09090B" />
        <circle cx="59" cy="53" r="1" fill="#FFFFFF" />
        {/* Cute Kawaii V-Smile */}
        <path
          d="M 47,60 L 50,63 L 53,60"
          fill="none"
          stroke="#09090B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Full Vector Logo based on the user's uploaded .dot Logo.png
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={typeof size === 'number' ? (size * 240) / 200 : size}
      className={`overflow-visible select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sunburst / Rays Crown on Top */}
      <g>
        {/* Ray 1 (Far Left) */}
        <polygon points="40,48 54,40 48,22 34,30" fill="#8B5CF6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
        {/* Ray 2 */}
        <polygon points="62,36 74,32 72,12 60,16" fill="#14B8A6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
        {/* Ray 3 (Center-Left) */}
        <polygon points="82,30 94,30 92,6 80,6" fill="#8B5CF6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
        {/* Ray 4 (Center-Right) */}
        <polygon points="106,30 118,30 120,6 108,6" fill="#8B5CF6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
        {/* Ray 5 */}
        <polygon points="126,32 138,36 140,16 128,12" fill="#14B8A6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
        {/* Ray 6 (Far Right) */}
        <polygon points="146,40 160,48 166,30 152,22" fill="#8B5CF6" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />

        {/* Central Crown Lightburst / Star Crest */}
        <polygon
          points="100,24 112,38 128,34 120,48 136,54 118,58 100,50 82,58 64,54 80,48 72,34 88,38"
          fill="#ECFDF5"
          stroke="#09090B"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* Frame / Shield Emblem */}
      <g>
        {/* Outer Frame (Teal) */}
        <path
          d="M 32,56 L 168,56 L 168,160 L 32,160 Z"
          fill="#14B8A6"
          stroke="#09090B"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Inner Purple Layer Geometric Polygon */}
        <path
          d="M 44,66 L 156,66 L 156,148 L 44,148 Z"
          fill="#8B5CF6"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Teal Accent Chevrons / Trim */}
        <polygon points="44,66 70,66 52,100 44,84" fill="#0D9488" stroke="#09090B" strokeWidth="2.5" />
        <polygon points="156,66 130,66 148,100 156,84" fill="#0D9488" stroke="#09090B" strokeWidth="2.5" />
        <polygon points="44,148 74,148 56,120 44,130" fill="#0D9488" stroke="#09090B" strokeWidth="2.5" />
        <polygon points="156,148 126,148 144,120 156,130" fill="#0D9488" stroke="#09090B" strokeWidth="2.5" />
      </g>

      {/* Robot Legs & Feet */}
      <g>
        {/* Left Leg */}
        <rect x="74" y="132" width="10" height="18" fill="#A78BFA" stroke="#09090B" strokeWidth="3.5" />
        {/* Left Foot */}
        <polygon points="66,160 88,160 86,148 70,148" fill="#8B5CF6" stroke="#09090B" strokeWidth="3.5" strokeLinejoin="round" />

        {/* Right Leg */}
        <rect x="116" y="132" width="10" height="18" fill="#A78BFA" stroke="#09090B" strokeWidth="3.5" />
        {/* Right Foot */}
        <polygon points="112,160 134,160 132,148 116,148" fill="#8B5CF6" stroke="#09090B" strokeWidth="3.5" strokeLinejoin="round" />
      </g>

      {/* Left Hanging Robot Arm */}
      <g>
        <path
          d="M 56,112 L 42,126 L 46,146 L 60,132 Z"
          fill="#A78BFA"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Claw Hand */}
        <path
          d="M 40,140 L 38,154 L 54,154 L 52,140 Z"
          fill="#8B5CF6"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="42" y1="154" x2="42" y2="160" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="154" x2="48" y2="162" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
        <line x1="53" y1="154" x2="54" y2="159" stroke="#09090B" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Right Waving Robot Arm */}
      <g>
        {/* Forearm Angle */}
        <path
          d="M 142,108 L 158,86 L 170,96 L 152,120 Z"
          fill="#A78BFA"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Hand Palm */}
        <rect
          x="158"
          y="74"
          width="18"
          height="18"
          rx="4"
          fill="#8B5CF6"
          stroke="#09090B"
          strokeWidth="3.5"
          transform="rotate(18 158 74)"
        />
        {/* Fingers waving */}
        <line x1="162" y1="70" x2="160" y2="62" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="170" y1="70" x2="171" y2="61" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="178" y1="73" x2="182" y2="65" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Mascot Turquoise Circle Character */}
      <g>
        <circle
          cx="100"
          cy="104"
          r="40"
          fill="#14B8A6"
          stroke="#09090B"
          strokeWidth="4.5"
        />

        {/* Cute Face: Kawaii Eyes & V-Smile */}
        {/* Left Eye */}
        <ellipse cx="88" cy="100" rx="4.5" ry="5.5" fill="#09090B" />
        <circle cx="89.5" cy="98" r="1.6" fill="#FFFFFF" />

        {/* Right Eye */}
        <ellipse cx="112" cy="100" rx="4.5" ry="5.5" fill="#09090B" />
        <circle cx="113.5" cy="98" r="1.6" fill="#FFFFFF" />

        {/* V Smile */}
        <path
          d="M 96,110 L 100,114 L 104,110"
          fill="none"
          stroke="#09090B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Typography: ".dot" */}
      <g transform="translate(24, 172)">
        {/* Teal Square Dot with Purple Shadow */}
        <rect x="10" y="32" width="14" height="14" rx="2" fill="#8B5CF6" />
        <rect x="8" y="30" width="14" height="14" rx="2" fill="#14B8A6" stroke="#09090B" strokeWidth="3.5" />

        {/* 'd' letter with Purple Shadow */}
        <g>
          {/* Shadow */}
          <path
            d="M 50,6 L 50,46 L 30,46 C 24,46 22,40 22,30 C 22,20 26,14 36,14 L 38,14 L 38,6 Z"
            fill="#8B5CF6"
          />
          {/* Main Black Glyph */}
          <path
            d="M 48,4 L 48,44 L 28,44 C 22,44 20,38 20,28 C 20,18 24,12 34,12 L 36,12 L 36,4 Z"
            fill="#09090B"
          />
          {/* Inner Counter Hole */}
          <ellipse cx="34" cy="28" rx="6" ry="7" fill="#FFFFFF" />
        </g>

        {/* 'o' letter with Purple Shadow */}
        <g transform="translate(42, 0)">
          {/* Shadow */}
          <ellipse cx="36" cy="30" rx="15" ry="16" fill="#8B5CF6" />
          {/* Main Black Glyph */}
          <ellipse cx="34" cy="28" rx="15" ry="16" fill="#09090B" />
          {/* Inner Counter Hole */}
          <ellipse cx="34" cy="28" rx="6.5" ry="7.5" fill="#FFFFFF" />
        </g>

        {/* 't' letter with Purple Shadow */}
        <g transform="translate(86, 0)">
          {/* Shadow */}
          <path
            d="M 12,6 L 22,6 L 22,14 L 30,14 L 30,22 L 22,22 L 22,36 C 22,42 26,44 32,42 L 32,48 C 24,50 12,48 12,38 L 12,22 L 6,22 L 6,14 L 12,14 Z"
            fill="#8B5CF6"
          />
          {/* Main Black Glyph */}
          <path
            d="M 10,4 L 20,4 L 20,12 L 28,12 L 28,20 L 20,20 L 20,34 C 20,40 24,42 30,40 L 30,46 C 22,48 10,46 10,36 L 10,20 L 4,20 L 4,12 L 10,12 Z"
            fill="#09090B"
          />
        </g>
      </g>
    </svg>
  );
};
