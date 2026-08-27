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
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52',
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
      {/* Floating hearts on click */}
      {clickHearts.map((id) => (
        <motion.div
          key={id}
          initial={{ opacity: 1, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -45, scale: 1.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute -top-3 text-emerald-500 pointer-events-none z-30 text-sm font-bold"
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
          className="mb-2 px-3.5 py-1.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-xs font-bold text-stone-900 flex items-center gap-1.5 z-10"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black" />
          <span>{getMessage()}</span>
        </motion.div>
      )}

      {/* Interactive Panda Vector SVG */}
      <motion.div
        onClick={handleInteraction}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          y: isBouncing ? -8 : mood === 'sleeping' ? [0, 2, 0] : isTimerRunning ? [0, -3, 0] : 0,
        }}
        transition={{
          repeat: isBouncing ? 0 : Infinity,
          duration: mood === 'sleeping' ? 3.5 : 2.2,
          ease: 'easeInOut',
        }}
        className={`cursor-pointer ${dimensions} relative flex items-center justify-center`}
        title="Click Pomo-Panda for a friendly encouragement!"
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-sm filter overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ambient Shadow */}
          <ellipse cx="80" cy="148" rx="42" ry="7" fill="#000000" opacity="0.08" />

          {/* Panda Ears */}
          {/* Left Ear */}
          <circle cx="44" cy="46" r="19" fill="#1e293b" />
          <circle cx="44" cy="46" r="11" fill="#334155" />

          {/* Right Ear */}
          <circle cx="116" cy="46" r="19" fill="#1e293b" />
          <circle cx="116" cy="46" r="11" fill="#334155" />

          {/* Sleeping nightcap if sleeping */}
          {mood === 'sleeping' && (
            <g className="origin-bottom-left">
              <path
                d="M 110,48 Q 140,15 145,55 Q 120,40 100,50 Z"
                fill="#6ee7b7"
                stroke="#059669"
                strokeWidth="2"
              />
              <circle cx="145" cy="55" r="7" fill="#ffffff" stroke="#059669" strokeWidth="2" />
            </g>
          )}

          {/* Focus Headband if in focus mode */}
          {mood === 'focus' && (
            <path
              d="M 32,58 Q 80,48 128,58"
              stroke="#10b981"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Panda Head Base */}
          <circle cx="80" cy="85" r="50" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

          {/* Eye Patches (Black Panda Oval Marks) */}
          {/* Left Eye Patch */}
          <ellipse
            cx="58"
            cy="78"
            rx="14"
            ry="18"
            fill="#1e293b"
            transform="rotate(-18 58 78)"
          />
          {/* Right Eye Patch */}
          <ellipse
            cx="102"
            cy="78"
            rx="14"
            ry="18"
            fill="#1e293b"
            transform="rotate(18 102 78)"
          />

          {/* Dynamic Eyes */}
          {mood === 'sleeping' ? (
            /* Sleeping Curved Eyes */
            <>
              <path
                d="M 50,78 Q 58,85 66,78"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 94,78 Q 102,85 110,78"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === 'celebrating' || mood === 'cheering' ? (
            /* Happy Happy Arc Eyes */
            <>
              <path
                d="M 51,80 Q 58,70 65,80"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 95,80 Q 102,70 109,80"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            /* Normal & Focus Eyes with Twinkle Sparkle */
            <>
              <circle cx="58" cy="78" r="6" fill="#ffffff" />
              <circle cx="59" cy="76" r="3" fill="#0f172a" />
              <circle cx="57" cy="74" r="1.5" fill="#ffffff" />

              <circle cx="102" cy="78" r="6" fill="#ffffff" />
              <circle cx="101" cy="76" r="3" fill="#0f172a" />
              <circle cx="103" cy="74" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Cute Rosy Cheeks */}
          <ellipse
            cx="44"
            cy="95"
            rx="8"
            ry="4.5"
            fill={mood === 'celebrating' ? '#f43f5e' : '#fb7185'}
            opacity="0.55"
          />
          <ellipse
            cx="116"
            cy="95"
            rx="8"
            ry="4.5"
            fill={mood === 'celebrating' ? '#f43f5e' : '#fb7185'}
            opacity="0.55"
          />

          {/* Cute Nose */}
          <path
            d="M 76,89 Q 80,86 84,89 Q 80,94 76,89 Z"
            fill="#1e293b"
          />

          {/* Cute Mouth */}
          {mood === 'celebrating' || mood === 'cheering' ? (
            <path
              d="M 74,96 Q 80,105 86,96"
              fill="#fb7185"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : mood === 'break' ? (
            <path
              d="M 75,95 Q 80,100 85,95"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 75,94 Q 80,98 85,94"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Cute Hands / Paws holding accessories */}
          {mood === 'focus' ? (
            /* Holding Bamboo Stick */
            <g>
              {/* Bamboo Cane */}
              <rect x="94" y="98" width="6" height="36" rx="2" fill="#10b981" transform="rotate(-25 94 98)" />
              <line x1="91" y1="108" x2="98" y2="105" stroke="#047857" strokeWidth="1.5" />
              <line x1="97" y1="120" x2="104" y2="117" stroke="#047857" strokeWidth="1.5" />
              {/* Bamboo Leaf */}
              <path d="M 103,96 Q 115,92 118,99 Q 110,102 103,96 Z" fill="#34d399" />
              {/* Right Paw */}
              <circle cx="94" cy="110" r="8" fill="#1e293b" />
              {/* Left Paw */}
              <circle cx="48" cy="118" r="8" fill="#1e293b" />
            </g>
          ) : mood === 'break' ? (
            /* Holding Tea Cup */
            <g>
              {/* Teacup */}
              <rect x="70" y="112" width="20" height="15" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
              {/* Steam */}
              <path d="M 76,108 Q 78,103 76,98" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M 84,108 Q 86,103 84,98" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
              {/* Paws */}
              <circle cx="68" cy="120" r="7" fill="#1e293b" />
              <circle cx="92" cy="120" r="7" fill="#1e293b" />
            </g>
          ) : mood === 'celebrating' || mood === 'cheering' ? (
            /* Raised Paws in celebration */
            <g>
              <circle cx="36" cy="74" r="9" fill="#1e293b" />
              <circle cx="124" cy="74" r="9" fill="#1e293b" />
              {/* Confetti stars */}
              <path d="M 28,52 L 30,56 L 34,56 L 31,59 L 32,63 L 28,60 L 24,63 L 25,59 L 22,56 L 26,56 Z" fill="#fbbf24" />
              <path d="M 130,48 L 132,51 L 135,51 L 133,53 L 134,56 L 131,54 L 128,56 L 129,53 L 127,51 L 130,51 Z" fill="#f43f5e" />
            </g>
          ) : (
            /* Rest Paws */
            <g>
              <circle cx="56" cy="122" r="8" fill="#1e293b" />
              <circle cx="104" cy="122" r="8" fill="#1e293b" />
            </g>
          )}

          {/* Sleeping floating 'Z's */}
          {mood === 'sleeping' && (
            <g className="text-emerald-600 font-bold">
              <text x="120" y="40" fontSize="13" fill="#10b981" opacity="0.9">Z</text>
              <text x="132" y="28" fontSize="16" fill="#059669" opacity="0.7">Z</text>
              <text x="146" y="16" fontSize="19" fill="#047857" opacity="0.5">Z</text>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
