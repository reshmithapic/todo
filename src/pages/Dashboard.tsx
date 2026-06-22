import { useState } from "react";
import { useTodos } from "../context/TodoContext";
import Header from "../component/Header";
import ConfirmDialog from "../component/ConfirmDialog";
import FilterBar from "../component/FilterBar";
import type { Filter } from "../component/FilterBar";

type DialogState =
  | { open: false }
  | { open: true; type: "delete" | "save" | "complete"; onConfirm: () => void };

const PRIORITY_STYLES = {
  High:   { border: "border-l-red-400",    badge: "bg-red-50 text-red-500 ring-1 ring-red-200",       dot: "bg-red-400"    },
  Medium: { border: "border-l-yellow-400", badge: "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200", dot: "bg-yellow-400" },
  Low:    { border: "border-l-green-400",  badge: "bg-green-50 text-green-600 ring-1 ring-green-200",   dot: "bg-green-400"  },
};

/* ── SVG icons ── */
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
  </svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
  </svg>
);
const CalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline mr-0.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
  </svg>
);

export default function Dashboard() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos();

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [exitingIds, setExitingIds] = useState<Set<number>>(new Set());
  const [completingId, setCompletingId] = useState<number | null>(null);

  const closeDialog = () => setDialog({ open: false });

  /* Animated delete — plays exit animation before removing */
  const animatedDelete = (id: number, afterClose: () => void) => {
    setExitingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      deleteTodo(id);
      setExitingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      afterClose();
    }, 260);
  };

  /* Animated complete — brief scale before toggling */
  const animatedComplete = (id: number, afterClose: () => void) => {
    setCompletingId(id);
    setTimeout(() => {
      toggleTodo(id);
      setCompletingId(null);
      afterClose();
    }, 300);
  };

  const handleAdd = () => {
    if (!task.trim()) return;
    addTodo(task, priority, dueDate);
    setTask("");
    setPriority("Medium");
    setDueDate("");
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };

  const saveEdit = () => {
    if (!editedText.trim() || !editingId) return;
    setDialog({
      open: true,
      type: "save",
      onConfirm: () => {
        editTodo(editingId, editedText);
        setEditingId(null);
        setEditedText("");
        closeDialog();
      },
    });
  };

  /* Stats */
  const today = new Date().toISOString().split("T")[0];
  const activeTodos   = todos.filter(t => !t.completed);
  const completedAll  = todos.filter(t =>  t.completed).length;
  const highCount     = activeTodos.filter(t => t.priority === "High").length;
  const dueTodayCount = activeTodos.filter(t => t.dueDate === today).length;
  const progress      = todos.length === 0 ? 0 : Math.round((completedAll / todos.length) * 100);

  const filtered = filter === "All" ? activeTodos : activeTodos.filter(t => t.priority === filter);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <Header />

      {/* Stats strip */}
      {todos.length > 0 && (
        <div className="fade-up mb-6 bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">Overall Progress</span>
            <span className="text-xs font-bold text-purple-700">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-purple-100 overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center py-2 px-3 rounded-xl bg-purple-50 border border-purple-100">
              <p className="text-lg font-bold text-purple-700">{activeTodos.length}</p>
              <p className="text-[10px] text-purple-400 font-medium uppercase tracking-wide">Active</p>
            </div>
            <div className="text-center py-2 px-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-lg font-bold text-red-500">{highCount}</p>
              <p className="text-[10px] text-red-400 font-medium uppercase tracking-wide">High Priority</p>
            </div>
            <div className="text-center py-2 px-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-lg font-bold text-blue-500">{dueTodayCount}</p>
              <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wide">Due Today</p>
            </div>
          </div>
        </div>
      )}

      {/* Compose */}
      <div className="fade-up bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-purple-100 mb-6">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">New Task</p>
        <div className="flex gap-2 sm:gap-3 mb-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl border border-purple-200 outline-none focus:ring-2 focus:ring-purple-300 text-sm placeholder-gray-300 transition-shadow"
          />
          <button
            onClick={handleAdd}
            disabled={!task.trim()}
            className="bg-purple-500 hover:bg-purple-600 active:scale-95 disabled:opacity-40 text-white px-4 sm:px-5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow-purple-200 hover:shadow-md"
          >
            + Add
          </button>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as "High" | "Medium" | "Low")}
            className="flex-1 px-3 sm:px-4 py-2 rounded-xl border border-purple-200 bg-white text-sm text-gray-600 transition-all"
          >
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟡 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 rounded-xl border border-purple-200 bg-white text-sm text-gray-600"
          />
        </div>
      </div>

      <FilterBar filter={filter} onFilterChange={setFilter} showUndo />

      {/* Task list */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="pop-in text-center py-14 bg-white rounded-2xl border border-purple-100 shadow-sm">
            <p className="text-4xl mb-3">🌸</p>
            <p className="text-purple-400 font-medium">No tasks here</p>
            <p className="text-purple-300 text-sm mt-1">
              {filter !== "All" ? `No ${filter.toLowerCase()} priority tasks` : "Add one above to get started"}
            </p>
          </div>
        ) : (
          filtered.map((todo, i) => {
            const ps = PRIORITY_STYLES[todo.priority];
            const isExiting   = exitingIds.has(todo.id);
            const isCompleting = completingId === todo.id;

            return (
              <div
                key={todo.id}
                className={`
                  flex items-center justify-between bg-white rounded-2xl
                  border border-purple-100 border-l-4 ${ps.border}
                  shadow-sm hover:shadow-md
                  transition-shadow duration-200
                  ${isExiting    ? "task-exit"     : "task-enter"}
                  ${isCompleting ? "task-complete"  : ""}
                `}
                style={{ animationDelay: isExiting ? "0ms" : `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 p-3 sm:p-4">
                  {/* Custom checkbox */}
                  <button
                    onClick={() =>
                      setDialog({
                        open: true,
                        type: "complete",
                        onConfirm: () => animatedComplete(todo.id, closeDialog),
                      })
                    }
                    className={`
                      shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 border-purple-300
                      flex items-center justify-center
                      hover:border-purple-500 hover:bg-purple-50
                      active:scale-90 transition-all duration-150
                    `}
                    title="Mark complete"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${ps.dot} opacity-0 hover:opacity-30 transition-opacity`} />
                  </button>

                  {editingId === todo.id ? (
                    <input
                      value={editedText}
                      onChange={e => setEditedText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="flex-1 border border-purple-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                  ) : (
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-gray-800 break-words text-sm sm:text-base leading-snug">
                        {todo.text}
                      </span>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ps.badge}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className={`text-[11px] font-medium ${todo.dueDate < today ? "text-red-400" : "text-gray-400"}`}>
                            <CalIcon />{todo.dueDate}
                            {todo.dueDate < today && " · Overdue"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 pr-3 sm:pr-4 shrink-0">
                  {editingId === todo.id ? (
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 bg-green-400 hover:bg-green-500 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    >
                      <SaveIcon /> Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(todo.id, todo.text)}
                      className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    >
                      <EditIcon /> Edit
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setDialog({
                        open: true,
                        type: "delete",
                        onConfirm: () => animatedDelete(todo.id, closeDialog),
                      })
                    }
                    className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={dialog.open}
        type={dialog.open ? dialog.type : "delete"}
        message={
          dialog.open && dialog.type === "delete"
            ? "Are you sure you want to delete this task?"
            : dialog.open && dialog.type === "save"
            ? "Save changes to this task?"
            : "Mark this task as completed?"
        }
        onConfirm={dialog.open ? dialog.onConfirm : closeDialog}
        onCancel={closeDialog}
      />

    </div>
  );
}
