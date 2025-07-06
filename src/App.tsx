import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { auth, getUserId, getUserNotes } from "./config/firebase";

import Login from "./components/Login";
import NotesPage from "./components/NotesPage";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { Note } from "./types/Note";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser && auth.currentUser != null) {
          setUser(currentUser);
          const currentUserId = await getUserId(currentUser);
          setUserId(currentUserId);
          const notes = await getUserNotes(currentUserId);
          setUserNotes(notes);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
      } finally {
        setLoading(false); // Ensure this runs no matter what
      }
    });
    return () => {
      unsubscribe();
    };
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              auth={auth}
              setLoading={setLoading}
              setUsername={setUsername}
            />
          }
        ></Route>
        <Route
          path="notes"
          element={
            user ? (
              <NotesPage
                notes={userNotes}
                userId={userId}
                user={user}
                username={username}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
