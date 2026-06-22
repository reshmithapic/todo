import { Routes, Route, Navigate } from "react-router-dom";
import { TodoProvider } from "./context/TodoContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./component/Sidebar";
import BottomNav from "./component/BottomNav";
import Dashboard from "./pages/Dashboard";
import Upcoming from "./pages/Upcoming";
import Completed from "./pages/Completed";
import StickyWall from "./pages/StickyWall";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { user } = useAuth();
  return (
    <TodoProvider userId={user!.id}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 overflow-y-auto pb-16 md:pb-0 flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/"            element={<Dashboard />} />
              <Route path="/upcoming"    element={<Upcoming />} />
              <Route path="/completed"   element={<Completed />} />
              <Route path="/sticky-wall" element={<StickyWall />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer className="hidden md:block border-t border-purple-100 bg-white/50 backdrop-blur-sm px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
                  ✅
                </div> */}
                <span className="text-sm font-semibold text-purple-700">Todo App</span>
                <span className="text-purple-300">·</span>
                <span className="text-xs text-purple-400">make a list to remember 💜</span>
              </div>
              <p className="text-xs text-purple-300">
                © {new Date().getFullYear()} · All tasks saved locally
              </p>
            </div>
          </footer>
        </main>
        <BottomNav />
      </div>
    </TodoProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/*" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
