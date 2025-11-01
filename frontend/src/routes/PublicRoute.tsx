import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function PublicRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  if (token && token.role === "admin") {
    return <Navigate to="/productForm" replace />;
  }
  if (token && token.role === "customer") {
    return <Navigate to="/product" replace />;
  }
  return <>{children}</>;
}

export default PublicRoute;
