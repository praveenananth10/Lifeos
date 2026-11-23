import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Plus,
  Check,
  CheckSquare,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Note, NoteCategory } from '../../types/lifeos';
import { cn } from '../../utils/cn';

export interface NoteEditorPaneProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onToggleChecklistItem: (noteId: string, itemId: string) => void;
  onAddChecklistItem: (noteId: string, text: string) => void;
  onDeleteChecklistItem: (noteId: string, itemId: string) => void;
  onNewNote: () => void;
}

const CATEGORIES: NoteCategory[] = ['Personal', 'Study', 'Work', 'Journal'];

export const NoteEditorPane: React.FC<NoteEditorPaneProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onToggleChecklistItem,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onNewNote,
}) => {
  const [newChecklistText, setNewChecklistText] = useState('');

  if (!note) {
    return (
      <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-3">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          No note selected
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
          Select an existing document from the sidebar or create a new note to start capturing ideas.
        </p>
        <Button variant="primary" size="sm" onClick={onNewNote} className="mt-4">
          Create Note
        </Button>
      </div>
    );
  }

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    onAddChecklistItem(note.id, newChecklistText.trim());
    setNewChecklistText('');
  };

  const checklistItems = note.checklist || [];

  return (
    <div className="h-full flex flex-col rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4 shadow-2xs">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <select
            value={note.category}
            onChange={(e) => onUpdateNote(note.id, { category: e.target.value as NoteCategory })}
            className="h-7 rounded-lg px-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Daily Journal Toggle */}
          <button
            type="button"
            onClick={() => onUpdateNote(note.id, { isJournal: !note.isJournal })}
            className={cn(
              'h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer',
              note.isJournal
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/60 font-semibold'
                : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700'
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>Daily Journal</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400">
            Updated {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          <button
            type="button"
            onClick={() => onDeleteNote(note.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Delete Note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Note Title Input */}
      <input
        type="text"
        placeholder="Note title..."
        value={note.title}
        onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
        className="w-full text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 bg-transparent border-0 focus:outline-none"
      />

      {/* Note Content Textarea */}
      <textarea
        placeholder="Start typing your thoughts, architecture notes, or journal reflection..."
        rows={8}
        value={note.content}
        onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
        className="w-full flex-1 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/80 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
      />

      {/* Embedded Checklist Section */}
      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Action Items &amp; Checklist
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {checklistItems.filter((c) => c.done).length}/{checklistItems.length}
            </Badge>
          </div>
        </div>

        {/* Checklist items list */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2 rounded-lg border border-zinc-200/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-xs hover:border-zinc-300"
            >
              <div
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => onToggleChecklistItem(note.id, item.id)}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors',
                    item.done
                      ? 'bg-emerald-500 text-white'
                      : 'border border-zinc-300 dark:border-zinc-600 hover:border-orange-500'
                  )}
                >
                  {item.done && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span
                  className={cn(
                    'truncate',
                    item.done
                      ? 'line-through text-zinc-400 dark:text-zinc-500'
                      : 'text-zinc-800 dark:text-zinc-200'
                  )}
                >
                  {item.text}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteChecklistItem(note.id, item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity ml-2 shrink-0 cursor-pointer"
                title="Delete item"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Checklist Item input */}
        <form onSubmit={handleAddChecklist} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new action item and press Enter..."
            value={newChecklistText}
            onChange={(e) => setNewChecklistText(e.target.value)}
            className="flex-1 h-8 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="h-8 px-2.5 text-xs"
            leftIcon={<Plus className="h-3 w-3" />}
          >
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

