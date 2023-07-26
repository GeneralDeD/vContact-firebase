import { Timestamp } from "firebase/firestore";
import { TagType } from "./TagPageTypes";

export type ContactType = {
  id: string;
  tags: TagType[];
  full_name: string;
  createdAt: Timestamp;
  email: string;
  phone: string;
};

export type ModalType = {
  isShow: boolean;
  role?: "add" | "edit";
  title?: "Contact adding" | "Contact editing";
  data?: ContactType;
};

export type DeleteModalType = { isShow: boolean; id?: string };
