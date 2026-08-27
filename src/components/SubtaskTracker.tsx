import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Plus, Check, Play, Pause, Trash2, Edit2, Sparkles, Clock, Target, CheckCircle2 } from 'lucide-react';
import { SubTask } from '../types';
import { formatHumanDuration, formatTime, parseDurationInput } from '../utils/time';
import { playBambooClick, playTaskCheer } from '../utils/audio';

interface SubtaskTrackerProps {
  tasks: SubTask[];
  activeTaskId: string | null;
  isTimerRunning: boolean;
  onSelectTask: (taskId: string) => void;
  onAddTask: (task: Omit<SubTask, 'id' | 'elapsedSeconds' | 'completed'>) => void;
  onUpdateTask: (task: SubTask) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  soundEnabled: boolean;
}

export const SubtaskTracker: React.FC<SubtaskTrackerProps> = ({
  tasks,
  activeTaskId,
  isTimerRunning,
  onSelectTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  soundEnabled,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDurationStr, setNewDurationStr] = useState('1h');
  const [newColor, setNewColor] = useState('emerald');

  // Edit task form state
  const [editTitle, setEditTitle] = useState('');
  const [editDurationStr, setEditDurationStr] = useState('');

  // Total session statistics
  const totalTargetSec = tasks.reduce((sum, t) => sum + t.targetSeconds, 0);
  const totalElapsedSec = tasks.reduce((sum, t) => sum + t.elapsedSeconds, 0);
  const overallPercent = totalTargetSec > 0 ? Math.min(100, Math.round((totalElapsedSec / totalTargetSec) * 100)) : 0;
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const seconds = parseDurationInput(newDurationStr) || 1800; // default 30 min if invalid
    onAddTask({
      title: newTitle.trim(),
      targetSeconds: seconds,
      colorTag: newColor,
    });

    if (soundEnabled) playBambooClick();
    setNewTitle('');
    setNewDurationStr('1h');
    setIsAdding(false);
  };

  const handleStartEdit = (task: SubTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDurationStr(formatHumanDuration(task.targetSeconds));
  };

  const handleSaveEdit = (task: SubTask) => {
    const seconds = parseDurationInput(editDurationStr) || task.targetSeconds;
    onUpdateTask({
      ...task,
      title: editTitle.trim() || task.title,
      targetSeconds: seconds,
    });
    setEditingTaskId(null);
  };

  const handleQuickPreset = () => {
    // Preset matching user's prompt: 3-hour study session with 1hr A, 1.5hr B, 30m C
    const presetTasks = [
      { title: 'Subject A - Deep Focus', targetSeconds: 3600, colorTag: 'emerald' },
      { title: 'Subject B - Practice & Review', targetSeconds: 5400, colorTag: 'amber' },
      { title: 'Subject C - Quick Revision', targetSeconds: 1800, colorTag: 'teal' },
    ];
    presetTasks.forEach((p) => onAddTask(p));
    if (soundEnabled) playBambooClick();
  };

  const colorPalette = [
    { name: 'emerald', bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'amber', bg: 'bg-amber-500', light: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'teal', bg: 'bg-teal-500', light: 'bg-teal-50 text-teal-700 border-teal-200' },
    { name: 'sky', bg: 'bg-sky-500', light: 'bg-sky-50 text-sky-700 border-sky-200' },
    { name: 'rose', bg: 'bg-rose-500', light: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'purple', bg: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 overflow-hidden" id="subtask-tracker-panel">
      {/* Header & Goal Summary */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-stone-900">Study Goals & Subtasks</span>
            <span className="px-2 py-0.5 bg-emerald-300 border border-black text-stone-950 text-[11px] font-black rounded-md shadow-[1px_1px_0px_0px_#000]">
              {completedCount}/{tasks.length} done
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            Total Goal: <span className="font-bold text-stone-900">{formatHumanDuration(totalTargetSec)}</span> • Done: <span className="font-bold text-emerald-800">{formatHumanDuration(totalElapsedSec)}</span>
          </p>
        </div>

        <button
          id="btn-add-subtask"
          onClick={() => {
            setIsAdding(!isAdding);
            if (soundEnabled) playBambooClick(0.3);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Bamboo Overall Progress Bar */}
      <div className="mt-3 mb-3 bg-stone-100 rounded-xl p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
        <div className="flex justify-between text-xs mb-1.5 font-bold">
          <span className="text-stone-800 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            Session Progress
          </span>
          <span className="font-black text-emerald-800">{overallPercent}%</span>
        </div>
        <div className="h-3.5 w-full bg-white border border-black rounded-full overflow-hidden flex relative">
          <motion.div
            className="h-full bg-emerald-400 border-r border-black"
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.4 }}
          />
          {/* Bamboo Joint notch dividers */}
          <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-40">
            <div className="w-0.5 h-full bg-black" />
            <div className="w-0.5 h-full bg-black" />
            <div className="w-0.5 h-full bg-black" />
          </div>
        </div>
      </div>

      {/* Add New Task Inline Drawer */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="mb-3 p-3.5 bg-[#E8F5E9] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] overflow-hidden"
          >
            <div className="text-xs font-black text-stone-900 mb-2">New Goal / Subtask</div>
            <div className="space-y-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Physics - Mechanics or Calculus"
                autoFocus
                className="w-full text-xs px-3 py-2 bg-white border-2 border-black rounded-xl focus:outline-none text-stone-950 font-bold placeholder:font-normal placeholder:text-stone-400"
              />
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Target Duration</label>
                  <input
                    type="text"
                    value={newDurationStr}
                    onChange={(e) => setNewDurationStr(e.target.value)}
                    placeholder="1h or 30m"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border-2 border-black rounded-xl focus:outline-none text-stone-950 font-bold"
                  />
                </div>
                {/* Preset Duration Chips */}
                <div className="flex gap-1 items-end pt-3">
                  {['30m', '1h', '1.5h', '2h'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setNewDurationStr(chip)}
                      className={`text-[11px] px-2 py-1 rounded-lg border border-black font-bold transition-all ${
                        newDurationStr === chip
                          ? 'bg-emerald-400 text-stone-950 shadow-[1px_1px_0px_0px_#000]'
                          : 'bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color tag picker */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-stone-700">Tag:</span>
                  {colorPalette.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setNewColor(c.name)}
                      className={`w-4 h-4 rounded-full ${c.bg} border border-black transition-transform ${
                        newColor === c.name ? 'ring-2 ring-stone-900 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-200/80 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar" id="subtask-list-container">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-300 border border-black flex items-center justify-center text-stone-900 mb-2 shadow-[2px_2px_0px_0px_#000]">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-800 mb-1">No subtasks created yet</p>
            <p className="text-[11px] text-stone-500 max-w-xs mb-3">
              Break your study goal into focused chunks (e.g. 1h Math, 1.5h Physics, 30m Notes).
            </p>
            <button
              onClick={handleQuickPreset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-300 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-black border border-black shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Example (1h A + 1.5h B + 30m C)
            </button>
          </div>
        ) : (
          tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const isEditing = editingTaskId === task.id;
            const progress = task.targetSeconds > 0 ? Math.min(100, Math.round((task.elapsedSeconds / task.targetSeconds) * 100)) : 0;
            const isOverTarget = task.elapsedSeconds > task.targetSeconds;

            return (
              <motion.div
                key={task.id}
                layout
                id={`subtask-item-${task.id}`}
                className={`relative group rounded-2xl p-3 border-2 transition-all ${
                  isActive
                    ? 'bg-[#E8F5E9] border-black shadow-[3px_3px_0px_0px_#000]'
                    : task.completed
                    ? 'bg-stone-100 border-stone-300 opacity-80'
                    : 'bg-white border-stone-300 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                {/* Active Tracking Ribbon Indicator */}
                {isActive && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500 text-[10px] font-black text-stone-950 border-l border-b border-black rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping" />
                    <span>Logging Now</span>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border-2 border-black rounded-xl bg-white font-bold"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editDurationStr}
                        onChange={(e) => setEditDurationStr(e.target.value)}
                        placeholder="e.g. 1.5h or 45m"
                        className="text-xs px-2.5 py-1 border-2 border-black rounded-xl bg-white flex-1 font-bold"
                      />
                      <button
                        onClick={() => handleSaveEdit(task)}
                        className="px-3 py-1 bg-emerald-400 text-stone-950 border border-black rounded-xl text-xs font-black shadow-[1px_1px_0px_0px_#000]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-2 py-1 text-stone-600 text-xs font-bold hover:bg-stone-200 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Top Row: Complete toggle, Title, Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {/* Checkbox Complete */}
                        <button
                          onClick={() => {
                            onToggleComplete(task.id);
                            if (!task.completed && soundEnabled) playTaskCheer();
                            else if (soundEnabled) playBambooClick(0.3);
                          }}
                          className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                            task.completed
                              ? 'bg-emerald-400 border-black text-stone-950 shadow-[1px_1px_0px_0px_#000]'
                              : 'border-black bg-white hover:bg-emerald-100 text-transparent'
                          }`}
                          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {task.title}
                            </span>
                            {isOverTarget && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-[#FEF08A] border border-black text-stone-900 rounded font-black shrink-0">
                                Over target +{formatHumanDuration(task.elapsedSeconds - task.targetSeconds)}
                              </span>
                            )}
                          </div>

                          {/* Time numbers */}
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-600">
                            <span className="font-mono font-bold text-stone-900">
                              {formatTime(task.elapsedSeconds)}
                            </span>
                            <span>/</span>
                            <span>Target: {formatHumanDuration(task.targetSeconds)}</span>
                            <span className="text-emerald-800 font-extrabold">({progress}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Active Logger Switch Button */}
                        <button
                          onClick={() => {
                            onSelectTask(task.id);
                            if (soundEnabled) playBambooClick(0.3);
                          }}
                          className={`p-1.5 rounded-xl text-xs font-black flex items-center gap-1 border border-black transition-all ${
                            isActive
                              ? isTimerRunning
                                ? 'bg-emerald-400 text-stone-950 shadow-[2px_2px_0px_0px_#000]'
                                : 'bg-emerald-200 text-stone-950 shadow-[1px_1px_0px_0px_#000]'
                              : 'bg-stone-100 hover:bg-emerald-200 text-stone-900'
                          }`}
                          title={isActive ? 'Currently active task' : 'Set as active tracking task'}
                        >
                          {isActive && isTimerRunning ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                          <span className="text-[10px] hidden sm:inline">
                            {isActive ? 'Active' : 'Track'}
                          </span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(task)}
                          className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            onDeleteTask(task.id);
                            if (soundEnabled) playBambooClick(0.3);
                          }}
                          className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtask specific mini progress bar */}
                    <div className="mt-2.5 h-2 w-full bg-stone-200 border border-black rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          task.completed
                            ? 'bg-stone-400'
                            : isOverTarget
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Quick increment buttons (+5m, +15m) */}
                    <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200">
                      <span className="flex items-center gap-1 font-medium">
                        {task.completed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span>
                            Remaining: {formatHumanDuration(Math.max(0, task.targetSeconds - task.elapsedSeconds))}
                          </span>
                        )}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            onUpdateTask({
                              ...task,
                              elapsedSeconds: Math.max(0, task.elapsedSeconds + 300),
                            });
                            if (soundEnabled) playBambooClick(0.2);
                          }}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-400 rounded-md font-bold transition-all"
                          title="Add 5 minutes elapsed"
                        >
                          +5m
                        </button>
                        <button
                          onClick={() => {
                            onUpdateTask({
                              ...task,
                              elapsedSeconds: Math.max(0, task.elapsedSeconds + 900),
                            });
                            if (soundEnabled) playBambooClick(0.2);
                          }}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-400 rounded-md font-bold transition-all"
                          title="Add 15 minutes elapsed"
                        >
                          +15m
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
