import { formatTime } from './time';

interface PiPData {
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchElapsedSeconds: number;
  mode: 'pomodoro' | 'stopwatch';
  phase: 'work' | 'short_break' | 'long_break';
  isRunning: boolean;
  activeTaskTitle: string;
  onTogglePlayPause: () => void;
  onSkipPhase: () => void;
}

let activePiPWindow: any = null;
let activePiPInterval: NodeJS.Timeout | null = null;
let currentPiPData: PiPData | null = null;

export const updatePiPData = (data: PiPData) => {
  currentPiPData = data;
};

export const isPiPSupported = (): boolean => {
  return typeof window !== 'undefined' && 'documentPictureInPicture' in window;
};

export const closePiP = () => {
  if (activePiPInterval) {
    clearInterval(activePiPInterval);
    activePiPInterval = null;
  }
  if (activePiPWindow) {
    try {
      activePiPWindow.close();
    } catch {
      // ignore
    }
    activePiPWindow = null;
  }
};

export const openCircularPiP = async (data: PiPData) => {
  if (!isPiPSupported()) return false;
  currentPiPData = data;

  try {
    // If already open, just update data
    if (activePiPWindow && !activePiPWindow.closed) {
      activePiPWindow.focus();
      return true;
    }

    const pip = await (window as any).documentPictureInPicture.requestWindow({
      width: 140,
      height: 140,
    });

    activePiPWindow = pip;

    // Base styling for seamless circular floating widget
    pip.document.head.innerHTML = `
      <meta charset="utf-8">
      <title>goPanda Floating</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #FAF9F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          user-select: none;
          cursor: pointer;
        }
        .widget-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .progress-ring {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }
        .circle-bg {
          cx: 60;
          cy: 60;
          r: 50;
          stroke: #E5E7EB;
          stroke-width: 6;
          fill: #FFFFFF;
        }
        .circle-border {
          cx: 60;
          cy: 60;
          r: 50;
          stroke: #000000;
          stroke-width: 6.5;
          fill: transparent;
        }
        .circle-progress {
          cx: 60;
          cy: 60;
          r: 50;
          stroke: #22C55E;
          stroke-width: 5;
          fill: transparent;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.4s ease;
        }
        .panda-center {
          position: absolute;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .time-badge {
          position: absolute;
          bottom: -2px;
          background: #1C1917;
          color: #FFFFFF;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1.5px solid #000000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          letter-spacing: -0.5px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ADE80;
        }
        .status-dot.paused {
          background: #FBBF24;
        }
        /* Quick hover actions */
        .hover-actions {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 30;
        }
        .widget-wrapper:hover .hover-actions {
          opacity: 1;
        }
        .act-btn {
          background: #FFFFFF;
          border: 2px solid #000000;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 1px 1px 0 #000;
          font-size: 12px;
          font-weight: 900;
          transition: transform 0.1s;
        }
        .act-btn:active {
          transform: scale(0.92);
        }
        .act-btn.play {
          background: #86EFAC;
        }
        .act-btn.pause {
          background: #FEF08A;
        }
      </style>
    `;

    const render = () => {
      if (!currentPiPData) return;
      const {
        remainingSeconds,
        totalDurationSeconds,
        stopwatchElapsedSeconds,
        mode,
        isRunning,
        activeTaskTitle,
      } = currentPiPData;

      const formattedTime = formatTime(
        mode === 'stopwatch' ? stopwatchElapsedSeconds : remainingSeconds
      );

      const progress =
        mode === 'stopwatch'
          ? Math.min(100, Math.round(((stopwatchElapsedSeconds % 1500) / 1500) * 100))
          : totalDurationSeconds > 0
          ? Math.min(
              100,
              Math.max(
                0,
                Math.round(
                  ((totalDurationSeconds - remainingSeconds) / totalDurationSeconds) * 100
                )
              )
            )
          : 0;

      const circumference = 2 * Math.PI * 50;
      const strokeDashoffset = circumference - (progress / 100) * circumference;

      pip.document.body.innerHTML = `
        <div class="widget-wrapper" title="${activeTaskTitle || 'goPanda Focus'} (${progress}%)">
          <svg class="progress-ring" viewBox="0 0 120 120">
            <circle class="circle-bg" />
            <circle class="circle-border" stroke-dasharray="${circumference}" stroke-dashoffset="0" />
            <circle class="circle-progress" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" />
          </svg>

          <div class="panda-center">
            <svg width="50" height="50" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="7" fill="#1C1917" stroke="#000000" stroke-width="2.5" />
              <circle cx="12" cy="12" r="3.5" fill="#44403C" />
              <circle cx="36" cy="12" r="7" fill="#1C1917" stroke="#000000" stroke-width="2.5" />
              <circle cx="36" cy="12" r="3.5" fill="#44403C" />
              <path d="M37 6 C42 4, 46 8, 44 13 C40 12, 38 9, 37 6 Z" fill="#4ADE80" stroke="#000000" stroke-width="1.5" />
              <rect x="6" y="9" width="36" height="34" rx="17" fill="#FFFFFF" stroke="#000000" stroke-width="2.5" />
              <ellipse cx="16" cy="23" rx="5.5" ry="6.5" transform="rotate(-15 16 23)" fill="#1C1917" stroke="#000000" stroke-width="1" />
              <circle cx="15" cy="21.5" r="2.2" fill="#FFFFFF" />
              <circle cx="17.5" cy="24.5" r="1" fill="#FFFFFF" />
              <ellipse cx="32" cy="23" rx="5.5" ry="6.5" transform="rotate(15 32 23)" fill="#1C1917" stroke="#000000" stroke-width="1" />
              <circle cx="31" cy="21.5" r="2.2" fill="#FFFFFF" />
              <circle cx="33.5" cy="24.5" r="1" fill="#FFFFFF" />
              <ellipse cx="11" cy="31" rx="3.5" ry="2.2" fill="#FDA4AF" opacity="0.9" />
              <ellipse cx="37" cy="31" rx="3.5" ry="2.2" fill="#FDA4AF" opacity="0.9" />
              <path d="M21.5 28 C21.5 27, 26.5 27, 26.5 28 C26.5 30, 24 31.5, 24 31.5 C24 31.5, 21.5 30, 21.5 28 Z" fill="#1C1917" />
              <path d="M20.5 33 Q22.2 35.5 24 33.2 Q25.8 35.5 27.5 33" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div class="time-badge">
            <span class="status-dot ${isRunning ? '' : 'paused'}"></span>
            <span>${formattedTime}</span>
          </div>

          <div class="hover-actions" id="pip-actions">
            <button class="act-btn ${isRunning ? 'pause' : 'play'}" id="btn-pip-toggle" title="${isRunning ? 'Pause' : 'Start'}">
              ${isRunning ? '⏸' : '▶'}
            </button>
            <button class="act-btn" id="btn-pip-skip" title="Skip Phase">
              ⏭
            </button>
          </div>
        </div>
      `;

      const toggleBtn = pip.document.getElementById('btn-pip-toggle');
      if (toggleBtn) {
        toggleBtn.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          currentPiPData?.onTogglePlayPause();
        };
      }

      const skipBtn = pip.document.getElementById('btn-pip-skip');
      if (skipBtn) {
        skipBtn.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          currentPiPData?.onSkipPhase();
        };
      }

      const wrapper = pip.document.querySelector('.widget-wrapper');
      if (wrapper) {
        wrapper.onclick = () => {
          currentPiPData?.onTogglePlayPause();
        };
      }
    };

    render();
    if (activePiPInterval) clearInterval(activePiPInterval);
    activePiPInterval = setInterval(render, 1000);

    pip.addEventListener('pagehide', () => {
      if (activePiPInterval) {
        clearInterval(activePiPInterval);
        activePiPInterval = null;
      }
      activePiPWindow = null;
    });

    return true;
  } catch (err) {
    console.warn('PiP window failed:', err);
    return false;
  }
};
