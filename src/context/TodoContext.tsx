import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string, priority: Todo["priority"], dueDate: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  deletedTodo: Todo | null;
  undoDelete: () => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const key = `todos_${userId}`;

  const [todos, setTodos] = useState<Todo[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  });
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

  // Reload when the logged-in user changes
  useEffect(() => {
    try { setTodos(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch { setTodos([]); }
    setDeletedTodo(null);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(todos));
  }, [todos, key]);

  const addTodo = (text: string, priority: Todo["priority"], dueDate: string) =>
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, priority, dueDate }]);

  const toggleTodo = (id: number) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) setDeletedTodo(todo);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const editTodo = (id: number, text: string) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));

  const undoDelete = () => {
    if (!deletedTodo) return;
    setTodos(prev => [...prev, deletedTodo]);
    setDeletedTodo(null);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, editTodo, deletedTodo, undoDelete }}>
      {children}
    </TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be inside TodoProvider");
  return ctx;
}
