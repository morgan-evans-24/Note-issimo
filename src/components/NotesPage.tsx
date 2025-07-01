import { useState } from "react";
import "./Layout.css";
import type { Note } from "../types/Note";
import { auth, setUserNotes } from "../config/firebase";
import { signOut, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  user: User;
  notes: Note[];
  userId: number;
  username: string;
}

const NotesPage = (props: Props) => {
  const [notes, setNotes] = useState(props.notes);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(-1);
  const [currentNote, setCurrentNote] = useState<Note>();
  const [notesChanged, setNotesChanged] = useState<boolean>();
  const navigate = useNavigate();

  function addNote() {
    const newNote: Note = {
      header: "New note",
      content: "",
      dateCreated: Date.now().toString(),
    };
    setNotes([...notes, newNote]);
  }

  function saveChanges() {
    console.log(notes);
    console.log(props.userId);
    setUserNotes(notes, props.userId);
  }

  function logOut() {
    signOut(auth).then(() => {
      setNotes([]);
      navigate("/");
    });
  }

  function updateNotes(updatedNote: Note) {
    const updatedNotes = [...notes];
    updatedNotes[selectedNoteIndex] = updatedNote;
    setCurrentNote(updatedNote);
    setNotes(updatedNotes);
    setNotesChanged(true);
  }

  function autoSave() {
    if (notesChanged) {
      saveChanges();
      setNotesChanged(false);
    }
  }

  return (
    <>
      <div className="layout-container">
        <div className="sidebar">
          <ul className="list-group list-group-flush">
            {notes.map((note, index) => (
              <li
                onClick={() => {
                  setSelectedNoteIndex(index);
                  setCurrentNote(note);
                  console.log(currentNote?.header);
                  console.log(currentNote?.content);
                }}
                key={index}
                className={
                  selectedNoteIndex === index
                    ? "list-group-item active"
                    : "list-group-item"
                }
              >
                {note.header || "<Unnamed Note>"}
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => addNote()}
                className="add-note-button"
              >
                +
              </button>
            </li>
          </ul>
          <button onClick={() => logOut()}>Log Out</button>
        </div>
        <div className="current-note">
          {selectedNoteIndex === -1 ? (
            <>
              <h1>Welcome to Note-issimo, {props.username}</h1>
            </>
          ) : (
            <>
              <input
                placeholder="Enter the title of this note here!"
                value={currentNote?.header}
                type="text"
                id="name"
                name="name"
                maxLength={25}
                onChange={(e) => {
                  console.log("in onchange header");
                  if (currentNote) {
                    console.log("in currentNote header");
                    const updatedNote = {
                      ...currentNote,
                      header: e.target.value,
                    };
                    updateNotes(updatedNote);
                  }
                }}
                onBlur={autoSave}
              />
              <textarea
                value={currentNote?.content || ""}
                placeholder="Enter text here..."
                onChange={(e) => {
                  console.log("in onchange");
                  if (currentNote) {
                    console.log("in currentNote");
                    const updatedNote = {
                      ...currentNote,
                      content: e.target.value,
                    };
                    updateNotes(updatedNote);
                  }
                }}
                onBlur={autoSave}
              ></textarea>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesPage;
