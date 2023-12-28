import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from "react";
import NoteDetail from "./NoteDetail";
import { Note } from "./Type";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");

        const notes: Note[] = await response.json();

        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setBody(note.body);
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("title: ", title);
    console.log("content: ", body);

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          createdAt: new Date().toISOString(),
        }),
      });
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle("");
      setBody("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body,
            createdAt: selectedNote.createdAt,
          }),
        }
      );
      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );
      setNotes(updatedNotesList);
      setTitle("");
      setBody("");
      setSelectedNote(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setBody("");
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: "DELETE",
      });
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (e) {}
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <React.Fragment>
                <form
                  className="note-form"
                  onSubmit={(e) =>
                    selectedNote ? handleUpdateNote(e) : handleAddNote(e)
                  }
                >
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Content"
                    rows={10}
                    required
                  />
                  {selectedNote ? (
                    <div className="edit-buttons">
                      <button type="submit">Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <button type="submit">Add Note</button>
                  )}
                </form>
                <div className="notes-grid">
                  {notes.length === 0 ? (
                    <div className="empty-state">Tidak ada catatan</div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className="note-item"
                      >
                        <div className="notes-header">
                          <button onClick={(e) => deleteNote(e, note.id)}>
                            x
                          </button>
                        </div>
                        <h2>{note.title}</h2>
                        <p>{note.body}</p>
                        <p>{note.createdAt}</p>
                        <Link to={`/notes/${note.id}`}>
                          <button className="detail-button">Detail</button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </React.Fragment>
            }
          />
          <Route path="/notes/:id" element={<NoteDetail notes={notes} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
