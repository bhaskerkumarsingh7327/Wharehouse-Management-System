const EMAIL_KEY = "ss_reset_email";
const TOKEN_KEY = "ss_reset_token";

const isBrowser = () => typeof window !== "undefined";

export const resetFlow = {
  getEmail: () => (isBrowser() ? sessionStorage.getItem(EMAIL_KEY) : null),
  getToken: () => (isBrowser() ? sessionStorage.getItem(TOKEN_KEY) : null),
  setEmail: (email: string) => sessionStorage.setItem(EMAIL_KEY, email),
  setToken: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    if (!isBrowser()) return;
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },
};