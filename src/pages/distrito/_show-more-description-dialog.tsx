import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ChevronRight } from 'lucide-react'

export default function ShowMoreDescription({
  description
}: {
  description: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-fit flex gap-2 items-center text-sm font-bold hover:text-gray-800"
        >
          <span className="underline">Mostrar más</span>
          <ChevronRight size={17} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70%] md:max-w-[50%] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Acerca de este Distrito
          </DialogTitle>
          <DialogDescription className="hidden">
            Información adicional
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm leading-6">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
