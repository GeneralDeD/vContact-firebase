import { persist, devtools } from "zustand/middleware";
import { create } from "zustand";

type useAuthStoreType = {
  isAuth: boolean;
  user: {
    email: string | null;
    name: string | null;
  } | null;
  setIsAuth: (isAuth: boolean, user: useAuthStoreType["user"]) => void;
};

export const useAuthStore = create<useAuthStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        isAuth: false,
        user: null,
        setIsAuth(isAuth, user) {
          set({
            isAuth,
            user,
          });
        },
      }),
      { name: "authStore" }
    ),
    { name: "authStore" }
  )
);
