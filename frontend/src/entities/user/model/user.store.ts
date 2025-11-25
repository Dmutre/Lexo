import { create } from 'zustand';

type UserState = {
  isAuth: boolean;
  username: string;
  email: string;
};

type UserActions = {
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setIsAuth: (isAuth: boolean) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  isAuth: false,
  username: '',
  email: '',
  setUsername: (username: string) => set({ username }),
  setEmail: (email: string) => set({ email }),
  setIsAuth: (isAuth: boolean) => set({ isAuth }),
}));
