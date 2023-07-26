import { create } from "zustand";

type useToastStoreType = {
  isShow: boolean;
  status: "Success" | "Error";
  message: string;
  variant: "success" | "danger" | undefined;
  setIsShow: (isShow: boolean, message?: string) => void;
  setInfoToast: (
    isShow: boolean,
    status: useToastStoreType["status"],
    message?: string,
    variant?: useToastStoreType["variant"]
  ) => void;
};

export const useToastStore = create<useToastStoreType>()((set, get) => ({
  isShow: false,
  status: "Success",
  message: "",
  variant: undefined,
  setIsShow(isShow) {
    set(() => ({
      isShow,
    }));
  },
  setInfoToast(isShow, status, message, variant) {
    set(() => ({
      isShow,
      status,
      message,
      variant,
    }));
  },
}));
