import React from 'react';
import { Search, Plus, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Note, NoteCategory } from '../../types/lifeos';
import { cn } from '../../utils/cn';

export interface NoteListSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onNewJournal: () => void;
  categoryFilter: NoteCategory | 'All';
  onCategoryFilterChange: (cat: NoteCategory | 'All') => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
}

const CATEGORIES: (NoteCategory | 'All')[] = ['All', 'Journal', 'Work', 'Study', 'Personal'];

export const NoteListSidebar: React.FC<NoteListSidebarProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onNewJournal,
  categoryFilter,
  onCategoryFilterChange,
  searchQuery,
  onSearchQueryChange,
}) => {
  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search & New Note buttons */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notes &amp; journals..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewNote}
            className="text-xs justify-center"
            leftIcon={<Plus className="h-3 w-3" />}
          >
            New Note
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onNewJournal}
            className="text-xs justify-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
            leftIcon={<BookOpen className="h-3 w-3" />}
          >
            Today's Journal
          </Button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryFilterChange(cat)}
            className={cn(
              'px-2 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer',
              categoryFilter === cat
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Note Cards List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 italic">
            No notes match your filters.
          </div>
        ) : (
          notes.map((note) => {
            const isSelected = note.id === selectedNoteId;
            const completedChecklist = (note.checklist || []).filter((c) => c.done).length;
            const totalChecklist = (note.checklist || []).length;

            const formattedTime = new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  'p-3.5 rounded-xl border text-left transition-all cursor-pointer select-none',
                  isSelected
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/30 shadow-xs'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    {note.isJournal && (
                      <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
                    )}
                    <h4
                      className={cn(
                        'text-xs font-semibold truncate',
                        isSelected
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      )}
                    >
                      {note.title || 'Untitled Note'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {formattedTime}
                  </span>
                </div>

                {note.content && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                    {note.category}
                  </Badge>

                  {totalChecklist > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                      <CheckSquare className="h-3 w-3" />
                      {completedChecklist}/{totalChecklist}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

