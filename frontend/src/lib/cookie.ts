export function getCookie(): string | null {
  const match = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
  console.log(match);
  return match ? match[2] : null;
}

export function setCookie(newToken: string) {
  document.cookie = `token=${newToken}; path=/; max-age=3600`;
}

export function removeCookie() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
