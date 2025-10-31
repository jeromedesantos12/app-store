import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function CustomerRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (token?.role !== "customer") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default CustomerRoute;
