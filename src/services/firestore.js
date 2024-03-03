import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const itemsCollection = collection(db, "items");

export const getItems = async () => {
  const snapshot = await getDocs(itemsCollection);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const createItem = async (item) => {
  await addDoc(itemsCollection, item);
};

// ... similar functions for update and delete
