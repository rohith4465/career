import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadProfilePhoto(userId: string, file: File) {
  const storageRef = ref(storage, `profile_photos/${userId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
