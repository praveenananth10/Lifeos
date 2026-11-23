import React, { useState, useMemo } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { NoteListSidebar } from '../../components/notes/NoteListSidebar';
import { NoteEditorPane } from '../../components/notes/NoteEditorPane';
import { useLifeOS } from '../../hooks/useLifeOS';
import type { Note, NoteCategory } from '../../types/lifeos';

export const NotesPage: React.FC = () => {
  const {
    notes,
    todayDate,
    addNote,
    updateNote,
    deleteNote,
    toggleNoteChecklistItem,
    addNoteChecklistItem,
    deleteNoteChecklistItem,
  } = useLifeOS();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return notes.length > 0 ? notes[0].id : null;
  });

  const [categoryFilter, setCategoryFilter] = useState<NoteCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileEditor, setShowMobileEditor] = useState(false);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        if (categoryFilter === 'Journal' && !note.isJournal && note.category !== 'Journal') {
          return false;
        }
        if (categoryFilter !== 'All' && categoryFilter !== 'Journal' && note.category !== categoryFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchContent = note.content.toLowerCase().includes(q);
          if (!matchTitle && !matchContent) return false;
        }
        return true;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, categoryFilter, searchQuery]);

  // Selected note object
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Handle Create New Note
  const handleCreateNewNote = () => {
    const newNoteData: Omit<Note, 'id' | 'updatedAt'> = {
      title: 'Untitled Note',
      content: '',
      category: 'Work',
      isJournal: false,
      checklist: [],
    };
    addNote(newNoteData);
    // Auto-select the newly created note on next render
    setTimeout(() => {
      setSelectedNoteId(`not-${Date.now()}`); // In store, id is generated; we can find by matching
    }, 50);
    setShowMobileEditor(true);
  };

  // Handle Today's Journal
  const handleCreateTodayJournal = () => {
    const journalTitle = `Daily Reflection & Journal (${todayDate})`;
    // Check if a journal already exists for today
    const existing = notes.find((n) => n.title.includes(todayDate) && n.isJournal);
    if (existing) {
      setSelectedNoteId(existing.id);
      setShowMobileEditor(true);
      return;
    }

    const journalContent = `Daily Reflection & Intentions
---------------------------------
1. High-impact wins & completed priorities today:
- 

2. Friction points, distractions, or bottlenecks:
- 

3. Top 3 non-negotiables for tomorrow:
- `;

    const journalChecklist = [
      { id: `chk-${Date.now()}-1`, text: "Review today's habit consistency", done: false },
      { id: `chk-${Date.now()}-2`, text: 'Clear immediate communication loops', done: false },
      { id: `chk-${Date.now()}-3`, text: 'Lock in tomorrow morning focus block', done: false },
    ];

    addNote({
      title: journalTitle,
      content: journalContent,
      category: 'Journal',
      isJournal: true,
      checklist: journalChecklist,
    });

    setShowMobileEditor(true);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setShowMobileEditor(true);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
      setShowMobileEditor(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Notes &amp; Daily Journal
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Markdown documentation, interconnected knowledge notes, and evening reflection logs.
          </p>
        </div>

        <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
          {notes.length} Active Notes
        </Badge>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Sidebar (visible on desktop or when mobile editor is false) */}
        <div
          className={`md:col-span-5 lg:col-span-4 h-full ${
            showMobileEditor ? 'hidden md:block' : 'block'
          }`}
        >
          <NoteListSidebar
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onNewNote={handleCreateNewNote}
            onNewJournal={handleCreateTodayJournal}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Right Column: Editor Pane (visible on desktop or when mobile editor is true) */}
        <div
          className={`md:col-span-7 lg:col-span-8 h-full flex flex-col ${
            !showMobileEditor ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Mobile Back Button */}
          <div className="md:hidden pb-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowMobileEditor(false)}
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              Back to Notes List
            </Button>
          </div>

          <div className="flex-1 min-h-0">
            <NoteEditorPane
              note={activeNote}
              onUpdateNote={updateNote}
              onDeleteNote={handleDeleteNote}
              onToggleChecklistItem={toggleNoteChecklistItem}
              onAddChecklistItem={addNoteChecklistItem}
              onDeleteChecklistItem={deleteNoteChecklistItem}
              onNewNote={handleCreateNewNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

