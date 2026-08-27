import { motion } from 'motion/react';
import React, { useState } from 'react';
import { PandaMood } from '../types';
import { playBambooClick } from '../utils/audio';

interface PandaMascotProps {
  mood: PandaMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  speechText?: string;
  isTimerRunning?: boolean;
  onPandaClick?: () => void;
}

export const PandaMascot: React.FC<PandaMascotProps> = ({
  mood,
  size = 'md',
  showSpeechBubble = true,
  speechText,
  isTimerRunning = false,
  onPandaClick,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [clickHearts, setClickHearts] = useState<number[]>([]);

  const handleInteraction = () => {
    playBambooClick(0.3);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    setClickHearts((prev) => [...prev.slice(-4), Date.now()]);
    if (onPandaClick) onPandaClick();
  };

  const dimensions = {
    sm: 'w-20 h-24',
    md: 'w-32 h-36',
    lg: 'w-44 h-48',
    xl: 'w-56 h-60',
  }[size];

  // Dynamic speech bubble text based on mood if not provided
  const getMessage = () => {
    if (speechText) return speechText;
    switch (mood) {
      case 'focus':
        return isTimerRunning ? 'In the zone! 🎋' : 'Ready when you are!';
      case 'break':
        return 'Sip some tea & rest 🍵';
      case 'sleeping':
        return 'Zzz... peaceful break...';
      case 'celebrating':
      case 'cheering':
        return 'Awesome work! High paw! 🐾';
      case 'happy':
      default:
        return 'Let’s study together! 🐼';
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none" id="panda-mascot-container">
      {/* Floating focus hearts on interaction */}
      {clickHearts.map((id) => (
        <motion.div
          key={id}
          initial={{ opacity: 1, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -45, scale: 1.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute -top-3 text-emerald-600 pointer-events-none z-30 text-xs font-black"
        >
          🎋 +1 Focus
        </motion.div>
      ))}

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          key={getMessage()}
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-1.5 px-3 py-1 bg-white border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] rounded-xl text-[11px] font-black text-stone-900 flex items-center gap-1.5 z-10"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black" />
          <span>{getMessage()}</span>
        </motion.div>
      )}

      {/* Interactive Full Panda Vector SVG */}
      <motion.div
        onClick={handleInteraction}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          y: isBouncing ? -10 : mood === 'sleeping' ? [0, 3, 0] : isTimerRunning ? [0, -4, 0] : [0, -2, 0],
        }}
        transition={{
          repeat: isBouncing ? 0 : Infinity,
          duration: mood === 'sleeping' ? 3.5 : isTimerRunning ? 2.0 : 2.6,
          ease: 'easeInOut',
        }}
        className={`cursor-pointer ${dimensions} relative flex items-center justify-center`}
        title="Click goPanda for positive study encouragement!"
      >
        <svg
          viewBox="0 0 160 180"
          className="w-full h-full drop-shadow-sm filter overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Floor Ambient Shadow */}
          <ellipse cx="80" cy="168" rx="46" ry="8" fill="#000000" opacity="0.12" />

          {/* === LOWER BODY & LEGS / FEET === */}
          {/* Left Foot / Leg */}
          <g>
            <ellipse cx="48" cy="156" rx="16" ry="11" fill="#1C1917" stroke="#000000" strokeWidth="2" />
            {/* Left Foot Paw Pad */}
            <circle cx="48" cy="156" r="5" fill="#44403C" opacity="0.8" />
            <circle cx="43" cy="150" r="2.2" fill="#44403C" opacity="0.8" />
            <circle cx="48" cy="148" r="2.2" fill="#44403C" opacity="0.8" />
            <circle cx="53" cy="150" r="2.2" fill="#44403C" opacity="0.8" />
          </g>

          {/* Right Foot / Leg */}
          <g>
            <ellipse cx="112" cy="156" rx="16" ry="11" fill="#1C1917" stroke="#000000" strokeWidth="2" />
            {/* Right Foot Paw Pad */}
            <circle cx="112" cy="156" r="5" fill="#44403C" opacity="0.8" />
            <circle cx="107" cy="150" r="2.2" fill="#44403C" opacity="0.8" />
            <circle cx="112" cy="148" r="2.2" fill="#44403C" opacity="0.8" />
            <circle cx="117" cy="150" r="2.2" fill="#44403C" opacity="0.8" />
          </g>

          {/* Main Chubby Torso Body */}
          <ellipse
            cx="80"
            cy="126"
            rx="42"
            ry="36"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Panda Belly White Patch */}
          <ellipse
            cx="80"
            cy="130"
            rx="28"
            ry="24"
            fill="#F8FAFC"
          />

          {/* === PANDA HEAD & EARS === */}
          {/* Left Ear */}
          <circle cx="44" cy="42" r="18" fill="#1C1917" stroke="#000000" strokeWidth="2.2" />
          <circle cx="44" cy="42" r="9" fill="#44403C" />

          {/* Right Ear */}
          <circle cx="116" cy="42" r="18" fill="#1C1917" stroke="#000000" strokeWidth="2.2" />
          <circle cx="116" cy="42" r="9" fill="#44403C" />

          {/* Sleeping Nightcap */}
          {mood === 'sleeping' && (
            <g className="origin-bottom-left">
              <path
                d="M 110,44 Q 142,12 146,50 Q 120,38 100,46 Z"
                fill="#6EE7B7"
                stroke="#000000"
                strokeWidth="2"
              />
              <circle cx="146" cy="50" r="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {/* Focus Headband */}
          {mood === 'focus' && (
            <g>
              <path
                d="M 32,54 Q 80,44 128,54"
                stroke="#10B981"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 32,54 Q 80,44 128,54"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Headband Center Sun / Dot */}
              <circle cx="80" cy="49" r="4" fill="#EF4444" stroke="#000000" strokeWidth="1" />
            </g>
          )}

          {/* Panda Head Base */}
          <circle
            cx="80"
            cy="78"
            r="46"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Eye Patches (Black Panda Oval Marks) */}
          {/* Left Eye Patch */}
          <ellipse
            cx="60"
            cy="74"
            rx="13"
            ry="16"
            fill="#1C1917"
            transform="rotate(-15 60 74)"
          />
          {/* Right Eye Patch */}
          <ellipse
            cx="100"
            cy="74"
            rx="13"
            ry="16"
            fill="#1C1917"
            transform="rotate(15 100 74)"
          />

          {/* Dynamic Kawaii Eyes */}
          {mood === 'sleeping' ? (
            /* Sleeping Curved Eyes */
            <>
              <path
                d="M 53,74 Q 60,81 67,74"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 93,74 Q 100,81 107,74"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === 'celebrating' || mood === 'cheering' ? (
            /* Happy Arched Eyes */
            <>
              <path
                d="M 53,76 Q 60,67 67,76"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 93,76 Q 100,67 107,76"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            /* Twinkle Sparkle Eyes */
            <>
              <circle cx="60" cy="74" r="5.5" fill="#FFFFFF" />
              <circle cx="61" cy="72.5" r="2.8" fill="#000000" />
              <circle cx="59" cy="71" r="1.4" fill="#FFFFFF" />

              <circle cx="100" cy="74" r="5.5" fill="#FFFFFF" />
              <circle cx="99" cy="72.5" r="2.8" fill="#000000" />
              <circle cx="101" cy="71" r="1.4" fill="#FFFFFF" />
            </>
          )}

          {/* Rosy Cheeks */}
          <ellipse
            cx="46"
            cy="88"
            rx="7"
            ry="4"
            fill={mood === 'celebrating' ? '#F43F5E' : '#FB7185'}
            opacity="0.65"
          />
          <ellipse
            cx="114"
            cy="88"
            rx="7"
            ry="4"
            fill={mood === 'celebrating' ? '#F43F5E' : '#FB7185'}
            opacity="0.65"
          />

          {/* Cute Nose */}
          <path
            d="M 76,82 Q 80,79 84,82 Q 80,87 76,82 Z"
            fill="#1C1917"
          />

          {/* Cute W-Shaped Kawaii Mouth */}
          {mood === 'celebrating' || mood === 'cheering' ? (
            <path
              d="M 74,89 Q 80,98 86,89"
              fill="#FB7185"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : mood === 'break' ? (
            <path
              d="M 75,88 Q 80,93 85,88"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 74,88 Q 77,91 80,88 Q 83,91 86,88"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* === ARMS & HANDS / PROPS === */}
          {mood === 'focus' ? (
            /* Holding Bamboo Cane */
            <g>
              {/* Bamboo Stick */}
              <rect x="96" y="90" width="7" height="42" rx="2" fill="#10B981" stroke="#000000" strokeWidth="1.5" transform="rotate(-20 96 90)" />
              <line x1="93" y1="102" x2="101" y2="99" stroke="#047857" strokeWidth="1.5" />
              <line x1="99" y1="116" x2="107" y2="113" stroke="#047857" strokeWidth="1.5" />
              {/* Bamboo Leaves */}
              <path d="M 104,88 Q 118,84 120,92 Q 112,95 104,88 Z" fill="#34D399" stroke="#000000" strokeWidth="1" />
              {/* Right Arm Paw */}
              <circle cx="96" cy="106" r="9" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
              {/* Left Arm Paw */}
              <circle cx="48" cy="116" r="9" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
            </g>
          ) : mood === 'break' ? (
            /* Holding Warm Tea Cup */
            <g>
              {/* Warm Teacup */}
              <rect x="69" y="108" width="22" height="16" rx="4" fill="#A7F3D0" stroke="#000000" strokeWidth="1.8" />
              {/* Steam */}
              <path d="M 75,103 Q 77,98 75,93" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 85,103 Q 87,98 85,93" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              {/* Paws holding cup */}
              <circle cx="66" cy="116" r="8" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
              <circle cx="94" cy="116" r="8" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
            </g>
          ) : mood === 'celebrating' || mood === 'cheering' ? (
            /* Raised High Paws */
            <g>
              <circle cx="34" cy="68" r="9.5" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
              <circle cx="126" cy="68" r="9.5" fill="#1C1917" stroke="#000000" strokeWidth="1.8" />
              {/* Confetti sparkle stars */}
              <path d="M 26,44 L 28,48 L 32,48 L 29,51 L 30,55 L 26,52 L 22,55 L 23,51 L 20,48 L 24,48 Z" fill="#FBBF24" stroke="#000000" strokeWidth="0.8" />
              <path d="M 132,40 L 134,43 L 137,43 L 135,45 L 136,48 L 133,46 L 130,48 L 131,45 L 129,43 L 132,43 Z" fill="#F43F5E" stroke="#000000" strokeWidth="0.8" />
            </g>
          ) : (
            /* Natural Resting Paws on Belly */
            <g>
              <ellipse cx="52" cy="118" rx="10" ry="8" fill="#1C1917" stroke="#000000" strokeWidth="1.8" transform="rotate(15 52 118)" />
              <ellipse cx="108" cy="118" rx="10" ry="8" fill="#1C1917" stroke="#000000" strokeWidth="1.8" transform="rotate(-15 108 118)" />
            </g>
          )}

          {/* Sleeping 'Z' indicators */}
          {mood === 'sleeping' && (
            <g>
              <text x="122" y="38" fontSize="13" fontWeight="900" fill="#10B981">Z</text>
              <text x="134" y="26" fontSize="16" fontWeight="900" fill="#059669">Z</text>
              <text x="148" y="14" fontSize="19" fontWeight="900" fill="#047857">Z</text>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
