import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../firebase/config";

/**
 * Upload Receipt
 */
export async function uploadReceipt(
  uid: string,
  childId: string,
  expenseId: string,
  file: File
) {
  const path = `receipts/${uid}/${childId}/${expenseId}/${file.name}`;

  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  return {
    url: downloadURL,
    path,
    name: file.name,
    type: file.type,
    size: file.size,
  };
}

/**
 * Delete Receipt
 */
export async function deleteReceipt(
  receiptPath: string
) {
  if (!receiptPath) return;

  const storageRef = ref(storage, receiptPath);

  await deleteObject(storageRef);
}