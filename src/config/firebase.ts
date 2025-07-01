import { initializeApp } from "firebase/app";
import { equalTo, get, getDatabase, orderByChild, query, ref, set} from "firebase/database";
import {
    getAuth,
    type User,
} from "firebase/auth";
import type { DBEntry } from "../types/DBEntry";
import type { Note } from "../types/Note";
import {key} from "./GoogleAPIKey"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: key,
  authDomain: "notes-app-7e005.firebaseapp.com",
  databaseURL: "https://notes-app-7e005-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "notes-app-7e005",
  storageBucket: "notes-app-7e005.firebasestorage.app",
  messagingSenderId: "311930646300",
  appId: "1:311930646300:web:b5da34bb42f5205118d4d9"
};

export const cong = initializeApp(firebaseConfig);
export const auth = getAuth(cong);

const db = getDatabase();

export function writeUserData(entry: DBEntry) {
  const reference = ref(db, 'users/' + entry.userId);

  set(reference, {
    email: entry.email,
    username: entry.username,
    notes: entry.notes    
  });
}


export async function getNumberUsers(): Promise<number> {
  const reference = ref(db, 'users/');
  const snapshot = await get(reference);

  if (snapshot.exists()) {
    console.log("Getting num users " + snapshot.size);
    return snapshot.size;
  }


  return 0;
}

export async function getUsername(userId: number): Promise<string> {
  const reference = ref (db, 'users/' + userId +'/username');
  const snapshot = await get(reference);

  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return "";


}

export async function getUserNotes(userId: number): Promise<Note[]> {
  const reference = ref (db, 'users/' + userId +'/notes');
  const snapshot = await get(reference);

  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return [];

}

export async function setUserNotes(notes: Note[], userId: number) {
  const reference = ref (db, 'users/' + userId);
  const snapshot = await get(reference);

  if (!snapshot.exists()) {
    return [];
  }
  
  const userEmail = snapshot.val().email;
  const username = snapshot.val().username;


  const newEntry: DBEntry = {
    userId: userId,
    email: userEmail,
    username: username,
    notes: notes
  }

  writeUserData(newEntry);
}

export async function getUserId(user: User): Promise<number> {
  const reference = ref (db, 'users/');
  const emailQuery = query(reference, orderByChild('email'), equalTo(user.email));
  const snapshot = await get(emailQuery);

  if (snapshot.exists()) {
    const users = snapshot.val();
    const userId = Object.keys(users)[0];
    return parseInt(userId);
  }
  return -1;
}
