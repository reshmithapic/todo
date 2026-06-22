import { useState, useEffect, useRef } from "react";
import ConfirmDialog from "../component/ConfirmDialog";

interface StickyNote {
  id: number;
  title: string;
  text: string;
  colorIndex: number;
  pinned: boolean;
  createdAt: number;
}

const PALETTE = [
  { accent: "#8B5CF6", light: "#F5F3FF", tag: "violet",  name: "Violet"  },
  { accent: "#3B82F6", light: "#EFF6FF", tag: "blue",    name: "Blue"    },
  { accent: "#10B981", light: "#ECFDF5", tag: "emerald", name: "Green"   },
  { accent: "#F59E0B", light: "#FFFBEB", tag: "amber",   name: "Yellow"  },
  { accent: "#EC4899", light: "#FDF2F8", tag: "pink",    name: "Pink"    },
  { accent: "#EF4444", light: "#FFF1F2", tag: "red",     name: "Red"     },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Edit Modal ─────────────────────────────────────────── */
interface EditModalProps {
  note: StickyNote;
  onSave: (title: string, text: string, colorIndex: number) => void;
  onDelete: () => void;
  onClose: () => void;
}

function EditModal({ note, onSave, onDelete, onClose }: EditModalProps) {
  const [title, setTitle]           = useState(note.title);
  const [text, setText]             = useState(note.text);
  const [colorIndex, setColorIndex] = useState(note.colorIndex);
  const [confirmDel, setConfirmDel] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const pal = PALETTE[colorIndex] ?? PALETTE[0];

  useEffect(() => {
    textRef.current?.focus();
    const len = note.text.length;
    textRef.current?.setSelectionRange(len, len);
  }, [note.text.length]);

  const save = () => { if (text.trim()) onSave(title.trim(), text.trim(), colorIndex); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#fff" }}
        onKeyDown={handleKey}
      >
        {/* Gradient top strip */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${pal.accent}, ${pal.accent}88)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: pal.light }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill={pal.accent}>
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Edit Note</span>
          </div>
          {/* Color picker */}
          <div className="flex items-center gap-1.5">
            {PALETTE.map((c, i) => (
              <button
                key={i}
                title={c.name}
                onClick={() => setColorIndex(i)}
                className="rounded-full transition-all duration-150 shrink-0"
                style={{
                  width: colorIndex === i ? 20 : 14,
                  height: colorIndex === i ? 20 : 14,
                  background: c.accent,
                  outline: colorIndex === i ? `2.5px solid ${c.accent}` : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Inputs */}
        <div className="px-5 pt-4 pb-2">
          <input
            type="text"
            placeholder="Note title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
            className="w-full text-sm font-bold text-gray-800 placeholder-gray-300 outline-none bg-transparent pb-2.5 border-b border-gray-100 mb-3"
          />
          <textarea
            ref={textRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your note…"
            rows={6}
            maxLength={500}
            className="w-full text-sm text-gray-600 placeholder-gray-300 outline-none resize-none bg-transparent leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className={`text-xs ${text.length > 440 ? "text-orange-400" : "text-gray-300"}`}>{text.length}/500</span>
            <span className="text-xs text-gray-300 hidden sm:block">⌘↵ save · Esc close</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDel(true)}
              className="text-xs px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 font-medium transition-all"
            >Delete</button>
            <button
              onClick={onClose}
              className="text-xs px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-medium transition-all"
            >Cancel</button>
            <button
              onClick={save}
              disabled={!text.trim()}
              className="text-xs px-4 py-2 rounded-xl font-semibold text-white disabled:opacity-40 transition-all"
              style={{ background: pal.accent }}
            >Save</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDel}
        type="delete"
        message="Delete this note permanently?"
        onConfirm={onDelete}
        onCancel={() => setConfirmDel(false)}
      />
    </>
  );
}

/* ── Note Card ─────────────────────────────────────────── */
interface NoteCardProps {
  note: StickyNote;
  index: number;
  onEdit: (note: StickyNote) => void;
  onTogglePin: (id: number) => void;
}

function NoteCard({ note, index, onEdit, onTogglePin }: NoteCardProps) {
  const pal = PALETTE[note.colorIndex] ?? PALETTE[0];
  return (
    <div
      className="break-inside-avoid mb-4 group cursor-pointer task-enter"
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => onEdit(note)}
      title="Click to edit"
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-250 hover:-translate-y-1 hover:shadow-xl"
        style={{
          background: "#ffffff",
          boxShadow: `0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)`,
          border: `1px solid ${pal.accent}22`,
        }}
      >
        {/* Gradient accent top */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${pal.accent}, ${pal.accent}55)` }}
        />

        <div className="p-4">
          {/* Tags row */}
          <div className="flex items-center gap-2 mb-2.5">
            {note.pinned && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: pal.light, color: pal.accent }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-.293.707L12 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-7.586L5.293 6.707A1 1 0 015 6V4z"/>
                </svg>
                Pinned
              </span>
            )}
          </div>

          {note.title && (
            <p className="text-sm font-bold text-gray-800 mb-1.5 leading-snug break-words">{note.title}</p>
          )}
          <p className="text-sm text-gray-500 leading-relaxed break-words whitespace-pre-wrap line-clamp-6">
            {note.text}
          </p>

          {/* Footer */}
          <div className="mt-3.5 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: pal.accent }} />
              <span className="text-[11px] text-gray-400">{timeAgo(note.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={e => { e.stopPropagation(); onTogglePin(note.id); }}
                title={note.pinned ? "Unpin" : "Pin"}
                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={note.pinned ? pal.accent : "#9ca3af"}>
                  <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-.293.707L12 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-7.586L5.293 6.707A1 1 0 015 6V4z"/>
                </svg>
              </button>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-[11px] text-gray-400 flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────── */
export default function StickyWall() {
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    try { return JSON.parse(localStorage.getItem("stickyNotes_v2") || "[]"); }
    catch { return []; }
  });

  const [composeTitle, setComposeTitle] = useState("");
  const [composeText, setComposeText]   = useState("");
  const [composeColor, setComposeColor] = useState(0);
  const [editingNote, setEditingNote]   = useState<StickyNote | null>(null);
  const [search, setSearch]             = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("stickyNotes_v2", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!composeText.trim()) return;
    setNotes(prev => [{
      id: Date.now(), title: composeTitle.trim(), text: composeText.trim(),
      colorIndex: composeColor, pinned: false, createdAt: Date.now(),
    }, ...prev]);
    setComposeTitle(""); setComposeText("");
    titleRef.current?.focus();
  };

  const saveEdit = (title: string, text: string, colorIndex: number) => {
    if (!editingNote) return;
    setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, title, text, colorIndex } : n));
    setEditingNote(null);
  };

  const deleteNote = (id: number) => { setNotes(prev => prev.filter(n => n.id !== id)); setEditingNote(null); };
  const togglePin  = (id: number) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const query    = search.toLowerCase();
  const filtered = [...notes]
    .filter(n => !query || n.title.toLowerCase().includes(query) || n.text.toLowerCase().includes(query))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const pinned   = filtered.filter(n =>  n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);
  const composePal = PALETTE[composeColor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 pb-20 md:pb-10">

      {/* Hero Header */}
      <div
        className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 40%, #4338ca 100%)" }}
      >
        {/* blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-24 translate-x-24"
          style={{ background: "radial-gradient(circle, #c084fc, transparent)" }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10 translate-y-16"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Sticky Notes</h1>
            </div>
            <p className="text-purple-200/80 text-sm ml-1">
              {notes.length === 0 ? "No notes yet" : `${notes.length} note${notes.length !== 1 ? "s" : ""}${pinned.length > 0 ? ` · ${pinned.length} pinned` : ""}`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/15 border border-white/20 outline-none focus:bg-white/20 focus:border-white/40 text-white placeholder-white/40 backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 pt-6">

        {/* Compose card */}
        <div
          className="rounded-2xl overflow-hidden mb-8 max-w-xl shadow-lg border"
          style={{ background: "#ffffff", borderColor: `${composePal.accent}22` }}
        >
          <div
            className="h-1 w-full transition-all duration-300"
            style={{ background: `linear-gradient(90deg, ${composePal.accent}, ${composePal.accent}55)` }}
          />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full transition-all duration-300" style={{ background: composePal.accent }} />
              <input
                ref={titleRef}
                type="text"
                placeholder="Note title (optional)"
                value={composeTitle}
                onChange={e => setComposeTitle(e.target.value)}
                maxLength={60}
                className="flex-1 text-sm font-semibold text-gray-700 placeholder-gray-300 outline-none bg-transparent"
              />
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            <textarea
              placeholder="What's on your mind? Press Enter to add…"
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), addNote())}
              rows={3}
              maxLength={500}
              className="w-full text-sm text-gray-600 placeholder-gray-300 outline-none resize-none bg-transparent leading-relaxed"
            />

            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-50">
              {/* Color swatches */}
              <div className="flex gap-2 items-center">
                {PALETTE.map((c, i) => (
                  <button
                    key={i}
                    title={c.name}
                    onClick={() => setComposeColor(i)}
                    className="rounded-full transition-all duration-150 shrink-0"
                    style={{
                      width: composeColor === i ? 22 : 16,
                      height: composeColor === i ? 22 : 16,
                      background: c.accent,
                      outline: composeColor === i ? `2.5px solid ${c.accent}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${composeText.length > 440 ? "text-orange-400" : "text-gray-300"}`}>
                  {composeText.length}/500
                </span>
                <button
                  onClick={addNote}
                  disabled={!composeText.trim()}
                  className="flex items-center gap-1.5 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-40 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${composePal.accent}, ${composePal.accent}cc)` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {notes.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-5 float"
              style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="font-bold text-gray-700 text-xl">No notes yet</p>
            <p className="text-gray-400 text-sm mt-1.5">Write something above to create your first note</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm text-gray-500">No notes match "<span className="font-medium">{search}</span>"</p>
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {pinned.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 bg-violet-100 text-violet-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-.293.707L12 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 016 17v-7.586L5.293 6.707A1 1 0 015 6V4z"/>
                    </svg>
                    Pinned
                  </div>
                  <div className="flex-1 h-px bg-violet-100" />
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {pinned.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onEdit={setEditingNote} onTogglePin={togglePin} />
                  ))}
                </div>
              </div>
            )}

            {/* All notes section */}
            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      Notes
                    </div>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {unpinned.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onEdit={setEditingNote} onTogglePin={togglePin} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {editingNote && (
        <EditModal
          note={editingNote}
          onSave={saveEdit}
          onDelete={() => deleteNote(editingNote.id)}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}
