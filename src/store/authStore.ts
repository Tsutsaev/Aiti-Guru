import { create } from 'zustand';
import type { AuthUser } from '../types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const getStoredUser = (): AuthUser | null => {
  try {
    const local = localStorage.getItem(USER_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(USER_KEY);
    if (session) return JSON.parse(session);
  } catch {
    return null;
  }
  return null;
};

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),

  login: (user, remember) => {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, user.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, user.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));