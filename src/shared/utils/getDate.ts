import { Timestamp } from "firebase/firestore";

export const getDate = (date: Timestamp) => {
  return date.toDate().toJSON().slice(0, 19).replace("T", " ");
};
