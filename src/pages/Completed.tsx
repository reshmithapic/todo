import { useState } from "react";
import { useTodos } from "../context/TodoContext";
import ConfirmDialog from "../component/ConfirmDialog";
import FilterBar from "../component/FilterBar";
import type { Filter } from "../component/FilterBar";

type DialogState =
  | { open: false }
  | { open: true; type: "delete" | "complete"; onConfirm: () => void };

const PRIORITY_BADGE: Record<string, string> = {
  High:   "bg-rose-100 text-rose-600 ring-1 ring-rose-200",
  Medium: "bg-amber-100 text-amber-600 ring-1 ring-amber-200",
  Low:    "bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200",
};

export default function Completed() {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [filter, setFilter] = useState<Filter>("All");

  const closeDialog = () => setDialog({ open: false });

  const base      = todos.filter(t => t.completed);
  const completed = filter === "All" ? base : base.filter(t => t.priority === filter);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto page-enter">

      {/* Header */}
      <div
        className="rounded-2xl p-5 sm:p-6 mb-6 text-white overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #0d9488 0%, #0891b2 60%, #6366f1 100%)" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-12 w-20 h-20 rounded-full bg-white/10 translate-y-8" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏆</span>
            <h1 className="text-2xl sm:text-3xl font-bold">Completed Tasks</h1>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            {base.length} task{base.length !== 1 ? "s" : ""} done — great work!
          </p>
        </div>
      </div>

      <FilterBar filter={filter} onFilterChange={setFilter} showUndo />

      {completed.length === 0 ? (
        <div className="pop-in text-center py-16 bg-white rounded-2xl border border-teal-100 shadow-sm">
          <p className="text-5xl mb-4 float">✅</p>
          <p className="font-semibold text-teal-600 text-lg">Nothing here yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter !== "All" ? `No ${filter.toLowerCase()} priority completed tasks` : "Check off tasks on the Dashboard to see them here"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {completed.map((todo, i) => (
            <div
              key={todo.id}
              className="task-enter flex items-center justify-between bg-white rounded-2xl border border-teal-100 border-l-4 border-l-teal-400 shadow-sm hover:shadow-md transition-all duration-200"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 p-3 sm:p-4">
                {/* Checkmark button */}
                <button
                  onClick={() =>
                    setDialog({
                      open: true,
                      type: "complete",
                      onConfirm: () => { toggleTodo(todo.id); closeDialog(); },
                    })
                  }
                  className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  title="Move back to active"
                >
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="font-medium text-gray-400 line-through text-sm sm:text-base break-words">{todo.text}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className="text-[11px] text-gray-400">📅 {todo.dueDate}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pr-3 sm:pr-4 shrink-0">
                <button
                  onClick={() =>
                    setDialog({
                      open: true,
                      type: "delete",
                      onConfirm: () => { deleteTodo(todo.id); closeDialog(); },
                    })
                  }
                  className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={dialog.open}
        type={dialog.open ? dialog.type : "delete"}
        message={
          dialog.open && dialog.type === "delete"
            ? "Are you sure you want to delete this task?"
            : "Move this task back to active?"
        }
        onConfirm={dialog.open ? dialog.onConfirm : closeDialog}
        onCancel={closeDialog}
      />
    </div>
  );
}
