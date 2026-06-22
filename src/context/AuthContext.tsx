import { createContext, useContext, useState } from "react";

interface User { id: string; name: string; email: string; }
interface StoredUser extends User { password: string; }

interface AuthContextType {
  user:   User | null;
  login:  (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string)      => { success: boolean; error?: string };
  logout: () => void;
}

const AUTH_USERS_KEY   = "auth_users";
const AUTH_SESSION_KEY = "auth_current";

const AuthContext = createContext<AuthContextType | null>(null);

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY)
             ?? sessionStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(user: User, remember: boolean) {
  const json = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(AUTH_SESSION_KEY, json);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } else {
    sessionStorage.setItem(AUTH_SESSION_KEY, json);
    localStorage.removeItem(AUTH_SESSION_KEY);
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const login = (email: string, password: string, remember: boolean) => {
    const found = getUsers().find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    const current: User = { id: found.id, name: found.name, email: found.email };
    saveSession(current, remember);
    setUser(current);
    return { success: true };
  };

  const signup = (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, error: "An account with this email already exists." };
    const newUser: StoredUser = { id: Date.now().toString(), name, email, password };
    saveUsers([...users, newUser]);
    const current: User = { id: newUser.id, name, email };
    saveSession(current, true);   // new accounts always remembered
    setUser(current);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
