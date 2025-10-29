import type { Dispatch, SetStateAction } from "react";
import type { TokenType } from "./token";

export type AuthContextType = {
  token: TokenType | null;
  setToken: Dispatch<SetStateAction<TokenType | null>>;
  fetchToken: () => Promise<void>;
};
