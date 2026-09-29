const ACCESS_KEY = "ss_access_token";
const REFRESH_KEY = "ss_refresh_token";

const isBrowser = () => typeof window !== "undefined";

export const tokenStore = {
  getAccess: () => (isBrowser() ? localStorage.getItem(ACCESS_KEY) : null),
  getRefresh: () => (isBrowser() ? localStorage.getItem(REFRESH_KEY) : null),
  set: (accessToken: string, refreshToken?: string) => {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};