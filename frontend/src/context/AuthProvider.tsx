import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { api, extractAxiosError } from "@/services/api";
import type { TokenType } from "@/types/token";

function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<TokenType | null>(null);
  async function fetchToken() {
    try {
      const res = await api.get("/verify");
      setToken({ id: res.data.data.id, role: res.data.data.role });
    } catch (err) {
      console.error(extractAxiosError(err));
    }
  }
  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, fetchToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
