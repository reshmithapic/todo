type ConfirmType = "delete" | "save" | "complete";

interface ConfirmDialogProps {
  isOpen: boolean;
  type: ConfirmType;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const config: Record<ConfirmType, {
  icon: string;
  confirmLabel: string;
  confirmClass: string;
  titleColor: string;
  gradient: string;
}> = {
  delete: {
    icon: "🗑️",
    confirmLabel: "Delete",
    confirmClass: "bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600",
    titleColor: "text-rose-600",
    gradient: "from-rose-50 to-pink-50",
  },
  save: {
    icon: "💾",
    confirmLabel: "Save",
    confirmClass: "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600",
    titleColor: "text-emerald-600",
    gradient: "from-emerald-50 to-teal-50",
  },
  complete: {
    icon: "✅",
    confirmLabel: "Confirm",
    confirmClass: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
    titleColor: "text-purple-600",
    gradient: "from-purple-50 to-indigo-50",
  },
};

export default function ConfirmDialog({ isOpen, type, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  const { icon, confirmLabel, confirmClass, titleColor, gradient } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn .2s ease both" }}
        onClick={onCancel}
      />

      {/* Card */}
      <div className={`dialog-in relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Gradient top strip */}
        <div className={`h-1.5 bg-gradient-to-r ${gradient.replace("from-", "from-").replace("to-", "to-")} `}
          style={{ background: type === "delete" ? "linear-gradient(90deg,#fb7185,#f43f5e)" : type === "save" ? "linear-gradient(90deg,#34d399,#14b8a6)" : "linear-gradient(90deg,#a855f7,#6366f1)" }}
        />

        <div className={`bg-gradient-to-br ${gradient} p-6`}>
          <div className="text-center mb-5">
            <span className="icon-bounce inline-block text-5xl">{icon}</span>
            <p className={`mt-3 font-semibold text-base leading-snug ${titleColor}`}>{message}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 text-sm font-medium transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl text-white text-sm font-semibold active:scale-95 transition-all shadow-md ${confirmClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
