import axios from "axios";
const baseURL: string = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export function extractAxiosError(err: unknown): string | null {
  return axios.isAxiosError(err) && err.response
    ? err.response.data.message
    : "Unexpected error";
}
