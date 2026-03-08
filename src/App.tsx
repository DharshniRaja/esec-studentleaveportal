import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCalendar from "./pages/StudentCalendar";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdvisorRecords from "./pages/AdvisorRecords";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AuthRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'student') return <Navigate to="/student" replace />;
  if (user?.role === 'advisor') return <Navigate to="/advisor" replace />;
  return <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LeaveProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/calendar" element={<ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute>} />
              <Route path="/advisor" element={<ProtectedRoute role="advisor"><AdvisorDashboard /></ProtectedRoute>} />
              <Route path="/advisor/records" element={<ProtectedRoute role="advisor"><AdvisorRecords /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LeaveProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
