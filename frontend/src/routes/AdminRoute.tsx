import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (token?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default AdminRoute;
