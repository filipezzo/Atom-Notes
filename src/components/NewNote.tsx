import { ChangeEvent, FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Pause, X } from "lucide-react";
import { toast } from "sonner";

type newNoteProps = {
  onAddNote: (newNote: string) => void;
};
export default function NewNote({ onAddNote }: newNoteProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  let speechRec: SpeechRecognition | null = null;

  function handleShowTextarea() {
    setShouldShowOnboarding(false);
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!text || text.trim().length === 0) {
      return;
    }
    onAddNote(text);
    setText("");
    setShouldShowOnboarding(true);
    toast.success("Nota criada com sucesso!");
  }

  function handleRecording() {
    const isSpeechRecAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecAvailable) {
      alert(
        "Infelizmente seu navegador não suporta a API de gravação. Tente outro navegador"
      );
      return;
    }
    setText("");
    setIsRecording(true);
    setShouldShowOnboarding(false);
    const SpeechRecAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRec = new SpeechRecAPI();

    speechRec.lang = "pt-BR";
    speechRec.continuous = true;
    speechRec.maxAlternatives = 1;
    speechRec.interimResults = true;

    speechRec.onresult = (event) => {
      const allResults = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, " ");
      setText(allResults);
    };

    speechRec.onerror = (event) => {
      console.error(event);
    };
    speechRec.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    if (speechRec !== null) {
      speechRec.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md outline-none  bg-slate-700 p-5 space-y-3 hover:ring-2  hover:ring-slate-600 flex flex-col text-start focus-visible:ring-2 focus-visible:ring-lime-300">
        <span className="text-slate-200">Adicionar nota</span>
        <p className="text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px]
        w-[90%] md:w-full h-[50vh] md:h-[60vh] bg-slate-700 rounded-md overflow-hidden outline-none flex flex-col
        "
        >
          <Dialog.Close className="absolute top-0 right-0 text-slate-400 bg-slate-800 hover:text-rose-400 p-1.5">
            <X
              className="size-5"
              onClick={() => setShouldShowOnboarding(true)}
            />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className=" flex flex-col gap-3 p-5 flex-1 ">
              <span className="text-slate-300">Adicionar nota</span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleRecording}
                    className="text-lime-400 hover:underline text-sm"
                  >
                    gravando uma nota{" "}
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    className="text-lime-400 hover:underline text-sm"
                    onClick={handleShowTextarea}
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <textarea
                  value={text}
                  autoFocus
                  className="flex-1 leading-6 text-slate-400 bg-transparent resize-none outline-none"
                  onChange={handleContentChange}
                />
              )}
            </div>

            {isRecording ? (
              <button
                onClick={handleStopRecording}
                type="button"
                className="w-full bg-slate-500 text-slate-100  py-4 gap-4 text-sm font-semibold hover:bg-slate-400/80  outline-none flex items-center justify-center"
              >
                Gravando
                <span className="text-rose-500">
                  <Pause size={18} className="font-bold" />
                </span>
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-lime-400 text-lime-950  py-4 text-center text-sm font-semibold hover:bg-lime-400/80  outline-none"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
