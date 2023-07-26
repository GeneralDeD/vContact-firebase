import { Timestamp } from "firebase/firestore";

export type TagType = {
  id: string;
  title: string;
  createdAt: Timestamp;
};

export type ModalType = {
  isShow: boolean;
  role?: "add" | "edit";
  title?: "Tag adding" | "Tag editing";
  data?: TagType;
};

export type DeleteModalType = { isShow: boolean; id?: string };
