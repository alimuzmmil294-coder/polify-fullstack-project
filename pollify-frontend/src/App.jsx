import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import MyPolls from "./pages/MyPolls";
import Voted from "./pages/Voted";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";

// Protects routes that require authentication
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

// Redirects already-authenticated users away from auth pages
function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <Signup />
          </PublicOnly>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicOnly>
            <VerifyEmail />
          </PublicOnly>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/create"
        element={
          <Protected>
            <CreatePoll />
          </Protected>
        }
      />
      <Route
        path="/my-polls"
        element={
          <Protected>
            <MyPolls />
          </Protected>
        }
      />
      <Route
        path="/voted"
        element={
          <Protected>
            <Voted />
          </Protected>
        }
      />
      <Route
        path="/saved"
        element={
          <Protected>
            <Saved />
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <Settings />
          </Protected>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
