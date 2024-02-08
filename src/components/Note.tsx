import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { INote } from "../App";

type noteProps = {
  note: INote;
  onDeleteNote: (noteId: string) => void;
};

export default function Note({ note, onDeleteNote }: noteProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-lime-300 bg-slate-800 p-5 text-left gap-3 flex flex-col overflow-hidden relative hover:ring-2 hover:ring-slate-600">
        <span className="text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <p className="text-sm text-ellipsis leading-6 text-pretty break-all whitespace-nowrap overflow-hidden">
          {note.content}
        </p>
        <div className="h-1/2  absolute bottom-0 left-0 right-0  pointer-events-none" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px]
          w-[90%] md:w-full h-[50vh] md:h-[60vh] bg-slate-700 rounded-md outline-none flex flex-col overflow-y-auto text-wrap break-all
        "
        >
          <Dialog.Close className="absolute top-0 right-0 text-slate-400 bg-slate-800 hover:text-rose-400 p-1.5">
            <X className="size-5" />
          </Dialog.Close>
          <div className=" flex flex-col gap-3 p-5 flex-1 ">
            <span className="text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm leading-6 text-slate-400">{note.content}</p>
          </div>
          <button
            onClick={() => onDeleteNote(note.id)}
            className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Deseja{" "}
            <span className="text-rose-400 group-hover:underline">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
