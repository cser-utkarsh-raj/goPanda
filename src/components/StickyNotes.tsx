import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Plus, Pin, Trash2, CheckSquare, AlignLeft, Check, Sparkles } from 'lucide-react';
import { StickyNote, StickyNoteColor } from '../types';
import { playBambooClick } from '../utils/audio';

interface StickyNotesProps {
  notes: StickyNote[];
  onAddNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (note: StickyNote) => void;
  onDeleteNote: (id: string) => void;
  soundEnabled: boolean;
}

const colorStyles: Record<StickyNoteColor, { bg: string; border: string; header: string; text: string; pin: string }> = {
  matcha: {
    bg: 'bg-[#E8F5E9]',
    border: 'border-black',
    header: 'bg-emerald-200/70',
    text: 'text-stone-950',
    pin: 'text-emerald-800 fill-emerald-800',
  },
  bamboo: {
    bg: 'bg-[#CCFBF1]',
    border: 'border-black',
    header: 'bg-teal-200/70',
    text: 'text-stone-950',
    pin: 'text-teal-800 fill-teal-800',
  },
  creamy: {
    bg: 'bg-[#FEF9C3]',
    border: 'border-black',
    header: 'bg-amber-200/70',
    text: 'text-stone-950',
    pin: 'text-amber-800 fill-amber-800',
  },
  peach: {
    bg: 'bg-[#FFE4E6]',
    border: 'border-black',
    header: 'bg-rose-200/70',
    text: 'text-stone-950',
    pin: 'text-rose-800 fill-rose-800',
  },
  lavender: {
    bg: 'bg-[#F3E8FF]',
    border: 'border-black',
    header: 'bg-purple-200/70',
    text: 'text-stone-950',
    pin: 'text-purple-800 fill-purple-800',
  },
  slate: {
    bg: 'bg-[#F1F5F9]',
    border: 'border-black',
    header: 'bg-stone-200/70',
    text: 'text-stone-950',
    pin: 'text-stone-800 fill-stone-800',
  },
};

export const StickyNotes: React.FC<StickyNotesProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');
  const [newChecklistText, setNewChecklistText] = useState<Record<string, string>>({});

  const handleCreateNew = (isChecklist: boolean = false) => {
    const defaultColors: StickyNoteColor[] = ['matcha', 'creamy', 'peach', 'bamboo', 'lavender'];
    const randomColor = defaultColors[notes.length % defaultColors.length];

    onAddNote({
      title: isChecklist ? 'Study Checklist' : 'Quick Study Note',
      content: isChecklist ? '' : '• Key formulas to remember\n• Chapter 4 review questions',
      color: randomColor,
      pinned: false,
      isChecklist,
      items: isChecklist
        ? [
            { id: '1', text: 'Solve exercise set 3.2', done: false },
            { id: '2', text: 'Summarize summary points', done: false },
          ]
        : [],
    });

    if (soundEnabled) playBambooClick();
  };

  const handleTogglePin = (note: StickyNote) => {
    onUpdateNote({ ...note, pinned: !note.pinned, updatedAt: Date.now() });
    if (soundEnabled) playBambooClick(0.3);
  };

  const handleToggleCheckItem = (note: StickyNote, itemId: string) => {
    const updatedItems = note.items.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onUpdateNote({ ...note, items: updatedItems, updatedAt: Date.now() });
    if (soundEnabled) playBambooClick(0.2);
  };

  const handleAddCheckItem = (note: StickyNote) => {
    const text = newChecklistText[note.id]?.trim();
    if (!text) return;

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      done: false,
    };

    onUpdateNote({
      ...note,
      items: [...note.items, newItem],
      updatedAt: Date.now(),
    });

    setNewChecklistText((prev) => ({ ...prev, [note.id]: '' }));
    if (soundEnabled) playBambooClick(0.2);
  };

  const handleDeleteCheckItem = (note: StickyNote, itemId: string) => {
    onUpdateNote({
      ...note,
      items: note.items.filter((i) => i.id !== itemId),
      updatedAt: Date.now(),
    });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  const displayedNotes = activeTab === 'pinned' ? sortedNotes.filter((n) => n.pinned) : sortedNotes;

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 overflow-hidden" id="sticky-notes-panel">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-black text-stone-900">Sticky Notes</span>
          <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-300 text-[11px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-stone-900 border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('pinned')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                activeTab === 'pinned' ? 'bg-white text-stone-900 border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pinned ({notes.filter((n) => n.pinned).length})
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-add-text-note"
            onClick={() => handleCreateNew(false)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FEF08A] hover:bg-[#FDE047] text-stone-950 border border-black rounded-xl text-xs font-bold transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Create Text Note"
          >
            <AlignLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Note</span>
          </button>
          <button
            id="btn-add-checklist-note"
            onClick={() => handleCreateNew(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Create Checklist Sticky Note"
          >
            <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1 custom-scrollbar" id="sticky-notes-grid">
        {displayedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300">
            <Sparkles className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-xs font-bold text-stone-800 mb-1">No sticky notes yet</p>
            <p className="text-[11px] text-stone-500 max-w-xs mb-3">
              Jot down quick reminders, key concepts, or a task checklist.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCreateNew(false)}
                className="px-3 py-1 bg-[#FEF08A] hover:bg-[#FDE047] text-stone-950 rounded-xl text-xs font-bold border border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                + Quick Note
              </button>
              <button
                onClick={() => handleCreateNew(true)}
                className="px-3 py-1 bg-emerald-400 hover:bg-emerald-500 text-stone-950 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                + Checklist
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {displayedNotes.map((note) => {
              const style = colorStyles[note.color] || colorStyles.matcha;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  id={`sticky-note-card-${note.id}`}
                  className={`rounded-2xl border-2 border-black ${style.bg} shadow-[3px_3px_0px_0px_#000] p-3.5 transition-all relative group`}
                >
                  {/* Top Note Bar */}
                  <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-black/15 mb-2">
                    {/* Note Title Input */}
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) =>
                        onUpdateNote({ ...note, title: e.target.value, updatedAt: Date.now() })
                      }
                      className={`text-xs font-black ${style.text} bg-transparent border-b border-transparent focus:border-black focus:outline-none flex-1 truncate`}
                      placeholder="Untitled note"
                    />

                    {/* Color Dots */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      {(['matcha', 'creamy', 'peach', 'bamboo', 'lavender', 'slate'] as StickyNoteColor[]).map(
                        (col) => (
                          <button
                            key={col}
                            onClick={() => {
                              onUpdateNote({ ...note, color: col, updatedAt: Date.now() });
                              if (soundEnabled) playBambooClick(0.1);
                            }}
                            className={`w-3 h-3 rounded-full border border-black transition-transform ${
                              col === 'matcha'
                                ? 'bg-emerald-400'
                                : col === 'creamy'
                                ? 'bg-yellow-300'
                                : col === 'peach'
                                ? 'bg-rose-300'
                                : col === 'bamboo'
                                ? 'bg-teal-400'
                                : col === 'lavender'
                                ? 'bg-purple-300'
                                : 'bg-stone-300'
                            } ${note.color === col ? 'ring-2 ring-black scale-125' : 'hover:scale-110'}`}
                            title={`Set color: ${col}`}
                          />
                        )
                      )}
                    </div>

                    {/* Pin button */}
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-1 rounded-lg border border-transparent transition-all ${
                        note.pinned
                          ? 'text-stone-950 bg-amber-300 border-black shadow-[1px_1px_0px_0px_#000]'
                          : 'text-stone-500 hover:text-stone-900 hover:bg-black/5'
                      }`}
                      title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-black' : ''}`} />
                    </button>

                    {/* Delete note */}
                    <button
                      onClick={() => {
                        onDeleteNote(note.id);
                        if (soundEnabled) playBambooClick(0.2);
                      }}
                      className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content Mode: Checklist vs Freeform Text */}
                  {note.isChecklist ? (
                    <div className="space-y-1.5">
                      {/* Items */}
                      {note.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-1.5 group/item py-0.5"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                              onClick={() => handleToggleCheckItem(note, item.id)}
                              className={`w-4 h-4 rounded-md border-2 border-black flex items-center justify-center transition-all shrink-0 ${
                                item.done
                                  ? 'bg-emerald-400 text-stone-950'
                                  : 'bg-white hover:bg-emerald-100'
                              }`}
                            >
                              {item.done && <Check className="w-3 h-3 stroke-[3.5]" />}
                            </button>
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => {
                                const updated = note.items.map((i) =>
                                  i.id === item.id ? { ...i, text: e.target.value } : i
                                );
                                onUpdateNote({ ...note, items: updated, updatedAt: Date.now() });
                              }}
                              className={`text-xs font-bold ${style.text} bg-transparent border-b border-transparent focus:border-black focus:outline-none flex-1 truncate ${
                                item.done ? 'line-through opacity-50' : ''
                              }`}
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteCheckItem(note, item.id)}
                            className="text-stone-400 hover:text-rose-600 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add new checklist item input */}
                      <div className="flex items-center gap-1.5 pt-1.5 mt-1 border-t border-black/10">
                        <Plus className="w-3.5 h-3.5 text-stone-600 shrink-0 stroke-[2.5]" />
                        <input
                          type="text"
                          value={newChecklistText[note.id] || ''}
                          onChange={(e) =>
                            setNewChecklistText((prev) => ({ ...prev, [note.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCheckItem(note);
                            }
                          }}
                          placeholder="Add list item (press Enter)..."
                          className={`text-xs font-bold ${style.text} bg-transparent focus:outline-none flex-1 placeholder:text-stone-500 placeholder:font-normal`}
                        />
                        {(newChecklistText[note.id] || '').trim() && (
                          <button
                            onClick={() => handleAddCheckItem(note)}
                            className="text-[10px] px-2 py-0.5 bg-emerald-400 border border-black text-stone-950 rounded-md font-black shadow-[1px_1px_0px_0px_#000]"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Freeform Multi-line Text Area */
                    <textarea
                      value={note.content}
                      onChange={(e) =>
                        onUpdateNote({ ...note, content: e.target.value, updatedAt: Date.now() })
                      }
                      rows={3}
                      placeholder="Write your study notes, insights, key terms..."
                      className={`w-full text-xs font-medium ${style.text} bg-transparent focus:outline-none resize-none leading-relaxed placeholder:text-stone-500`}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
