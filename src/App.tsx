import { Atom } from "lucide-react";
import NewNote from "./components/NewNote";
import Note from "./components/Note";
import { ChangeEvent, useState } from "react";

export type INote = {
  id: string;
  date: Date;
  content: string;
};

function App() {
  const [notes, setNotes] = useState<INote[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  function handleAddNotes(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }
  function handleDeleteNotes(noteId: string) {
    const removeNoteById = notes.filter((note) => note.id !== noteId);
    setNotes(removeNoteById);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchTerm(query);
  }

  const filteredNotes =
    searchTerm !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : notes;

  return (
    <div className="antialiased p-5 w-full md:max-w-6xl md:mx-auto my-12 space-y-6">
      <strong className="flex text-slate-500 gap-px">
        <Atom className="text-slate-500" /> Notes
      </strong>
      <form>
        <input
          value={searchTerm}
          onChange={handleSearch}
          className="outline-none w-full bg-transparent font-semibold text-3xl tracking-tight placeholder:text-slate-500 "
          type="text"
          placeholder="Busque em suas notas..."
        />
      </form>

      <div className="h-px bg-slate-700" />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNote onAddNote={handleAddNotes} />
        {filteredNotes.length > 0 &&
          filteredNotes.map((note) => (
            <Note note={note} key={note.id} onDeleteNote={handleDeleteNotes} />
          ))}
      </section>
    </div>
  );
}

export default App;
