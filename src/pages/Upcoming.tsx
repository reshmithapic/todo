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

const PRIORITY_BORDER: Record<string, string> = {
  High:   "border-l-rose-400",
  Medium: "border-l-amber-400",
  Low:    "border-l-emerald-400",
};

export default function Upcoming() {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const [dialog, setDialog]   = useState<DialogState>({ open: false });
  const [filter, setFilter]   = useState<Filter>("All");

  const closeDialog = () => setDialog({ open: false });

  const today = new Date().toISOString().split("T")[0];
  const base  = todos.filter(t => !t.completed && t.dueDate && t.dueDate >= today);
  const upcoming = (filter === "All" ? base : base.filter(t => t.priority === filter))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto page-enter">

      {/* Header */}
      <div
        className="rounded-2xl p-5 sm:p-6 mb-6 text-white overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}
      >
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-8 w-24 h-24 rounded-full bg-white/10 translate-y-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗓️</span>
            <h1 className="text-2xl sm:text-3xl font-bold">Upcoming Tasks</h1>
          </div>
          <p className="text-indigo-200 text-sm mt-1">
            {base.length} task{base.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>
      </div>

      <FilterBar filter={filter} onFilterChange={setFilter} showUndo />

      {upcoming.length === 0 ? (
        <div className="pop-in text-center py-16 bg-white rounded-2xl border border-indigo-100 shadow-sm">
          <p className="text-5xl mb-4 float">🗓️</p>
          <p className="font-semibold text-indigo-500 text-lg">No upcoming tasks</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter !== "All" ? `No ${filter.toLowerCase()} priority upcoming tasks` : "Add a due date to a task on the Dashboard"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((todo, i) => {
            const isToday  = todo.dueDate === today;
            const daysLeft = Math.ceil(
              (new Date(todo.dueDate).getTime() - new Date(today).getTime()) / 86400000
            );

            return (
              <div
                key={todo.id}
                className={`task-enter flex items-center justify-between bg-white rounded-2xl border border-l-4 ${PRIORITY_BORDER[todo.priority]} shadow-sm hover:shadow-md transition-all duration-200 ${isToday ? "due-today border-orange-200" : "border-indigo-100"}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 p-3 sm:p-4">
                  {/* Checkbox */}
                  <button
                    onClick={() =>
                      setDialog({
                        open: true,
                        type: "complete",
                        onConfirm: () => { toggleTodo(todo.id); closeDialog(); },
                      })
                    }
                    className="shrink-0 w-5 h-5 rounded-full border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 active:scale-90 transition-all"
                    title="Mark complete"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{todo.text}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[todo.priority]}`}>
                        {todo.priority}
                      </span>
                      {/* Due badge */}
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isToday
                          ? "bg-orange-100 text-orange-600 ring-1 ring-orange-300"
                          : daysLeft <= 3
                          ? "bg-rose-50 text-rose-500 ring-1 ring-rose-200"
                          : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                      }`}>
                        {isToday ? "🔥 Due Today" : daysLeft <= 3 ? `⚠️ ${daysLeft}d left` : `📅 ${daysLeft}d left`}
                      </span>
                      <span className="text-[11px] text-gray-400 hidden sm:inline">{todo.dueDate}</span>
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
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={dialog.open}
        type={dialog.open ? dialog.type : "delete"}
        message={
          dialog.open && dialog.type === "delete"
            ? "Are you sure you want to delete this task?"
            : "Mark this task as completed?"
        }
        onConfirm={dialog.open ? dialog.onConfirm : closeDialog}
        onCancel={closeDialog}
      />
    </div>
  );
}
