import { useParams, Link } from "react-router-dom";
import { Note } from "./Type";
import "./App.css";

type Props = {
  notes: Note[];
};

const NoteDetail = ({ notes }: Props) => {
  let { id } = useParams<{ id: string }>();
  if (id === undefined) {
    return <div>Invalid URL: No ID provided</div>;
  }

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return <div>Invalid URL: ID is not a number</div>;
  }
  const selectedNote = notes.find((note) => note.id === parsedId);

  if (!selectedNote) {
    return <div>Catatan tidak ditemukan</div>;
  }

  return (
    <div className="note-detail">
      <h2>{selectedNote.title}</h2>
      <p>{selectedNote.body}</p>
      <p>{selectedNote.createdAt}</p>
      <Link to="/">Kembali</Link>
    </div>
  );
};

export default NoteDetail;
