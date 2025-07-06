import { useState } from "react";
import type { Note } from "../types/Note";
import { auth, setUserNotes } from "../config/firebase";
import { signOut, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./CSS/Layout.css";
import "./CSS/NotesPage.css";
import { Button } from "react-bootstrap";
import TypeWriter from "typewriter-effect";
import { HiOutlineTrash } from "react-icons/hi2";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
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

  function deleteNote() {
    // TODO Finish this function, style button
  }

  return (
    <>
      <div className="layout-container">
        <div className="sidebar">
          <ul className="list-group list-group-flush">
            {notes.map((note, index) => (
              <>
                <li
                  onClick={() => {
                    setSelectedNoteIndex(index);
                    setCurrentNote(note);
                    setIsEditing(false);
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
                <HiOutlineTrash
                  onClick={() => {
                    deleteNote();
                  }}
                ></HiOutlineTrash>
              </>
            ))}
            <li>
              <Button
                type="button"
                onClick={() => addNote()}
                className="add-note-button"
              >
                +
              </Button>
            </li>
          </ul>
          <Button onClick={() => logOut()} className="logout-button">
            Log Out
          </Button>
        </div>
        <div className="current-note">
          {selectedNoteIndex === -1 ? (
            <>
              <h1>
                {
                  <TypeWriter
                    onInit={(typewriter) => {
                      const note =
                        "What needs jotting down today, " +
                        props.username +
                        "?";
                      typewriter
                        .changeDelay(40)
                        .typeString(note)
                        .pauseFor(1000)
                        .start();
                    }}
                  />
                }
              </h1>
            </>
          ) : (
            <>
              <div className="header-style">
                <input
                  className="header"
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
              </div>
              <Button
                className="edit-read-button"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? "Read Mode" : "Edit Mode"}
              </Button>
              <div className="text-area">
                {isEditing ? (
                  <textarea
                    className="content"
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
                ) : (
                  <div className="content">
                    <ReactMarkdown>{currentNote?.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesPage;
