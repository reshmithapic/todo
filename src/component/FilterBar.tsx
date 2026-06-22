import { useTodos } from "../context/TodoContext";

export type Filter = "All" | "High" | "Medium" | "Low";

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  showUndo?: boolean;
}

const FILTER_STYLES: Record<Filter, { active: string; inactive: string }> = {
  All:    { active: "bg-purple-500 text-white shadow-purple-200 shadow-md",  inactive: "bg-white text-purple-600 border border-purple-200 hover:bg-purple-50"  },
  High:   { active: "bg-rose-500 text-white shadow-rose-200 shadow-md",      inactive: "bg-white text-rose-500 border border-rose-200 hover:bg-rose-50"        },
  Medium: { active: "bg-amber-400 text-white shadow-amber-200 shadow-md",    inactive: "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"     },
  Low:    { active: "bg-emerald-500 text-white shadow-emerald-200 shadow-md",inactive: "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"},
};

export default function FilterBar({ filter, onFilterChange, showUndo = false }: FilterBarProps) {
  const { deletedTodo, undoDelete } = useTodos();

  return (
    <div className="flex gap-2 mb-5 flex-wrap items-center fade-up">
      {(["All", "High", "Medium", "Low"] as const).map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
            filter === f ? FILTER_STYLES[f].active : FILTER_STYLES[f].inactive
          }`}
        >
          {f}
        </button>
      ))}
      {showUndo && (
        <button
          onClick={undoDelete}
          disabled={!deletedTodo}
          className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-indigo-500 border border-indigo-200 hover:bg-indigo-50 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          ↩ Undo
        </button>
      )}
    </div>
  );
}
