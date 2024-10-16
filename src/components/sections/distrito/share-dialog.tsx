import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/dialog'
import FacebookIcon from '@/components/icons/facebook'
import WhatsAppIcon from '@/components/icons/whatsapp'
import TwitterIcon from '@/components/icons/x-twitter'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'
import { Copy, Share } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { WhatsappShare, FacebookShare, TwitterShare } from 'react-share-lite'
import type { Toast } from '@/hooks/use-toast'
import copyTextToClipboard from '@/utils/copy-to-clipboard'

interface ShareDialogProps {
  distrito: {
    image?: string
    name: string
  }
}

interface ShareableItemProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'button'
  children: ReactNode
}

const REACT_SHARE_BUTTON_STYLES = Object.freeze({
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0
})

function ShareableItem({ children, variant, ...props }: ShareableItemProps) {
  const className = cn(
    props.className,
    'relative flex gap-5 items-center border-[1.9px] border-secondary rounded-md p-2 w-full hover:bg-gray-200 transition-colors'
  )

  if (variant === 'button') {
    return (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    )
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export default function ShareDialog({ distrito }: ShareDialogProps) {
  const { toast } = useToast()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex gap-2 items-center text-sm p-2 hover:bg-gray-200 hover:rounded-md focus:scale-95 transition-all"
        >
          <Share size={15} />
          <span className="underline"> Compartir </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Compartí este espacio
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Descrubre {distrito.name}
        </DialogDescription>
        <ul className="grid grid-cols-2 gap-2 mt-5">
          <li className="text-sm">
            <ShareableItem
              variant="button"
              onClick={async () => {
                const response = await copyTextToClipboard(window.location.href)

                const toastBehavior: Toast =
                  response.status === 'success'
                    ? { title: 'Enlace copiado' }
                    : {
                        title: 'Hubo un error al copiar el enlace',
                        variant: 'destructive'
                      }

                toast({ ...toastBehavior, duration: 700 })
              }}
            >
              <Copy />
              <span className="absolute flex items-center justify-center w-full h-full">
                Copiar enlace
              </span>
            </ShareableItem>
          </li>
          <li className="text-sm">
            <ShareableItem>
              <WhatsAppIcon />
              <WhatsappShare
                url={window.location.href}
                title={`Descubre ${distrito.name} gracias a Destino Ñeembucú!`}
                buttonTitle="Whatsapp"
                style={REACT_SHARE_BUTTON_STYLES}
                blankTarget={true}
              />
            </ShareableItem>
          </li>
          <li className="text-sm">
            <ShareableItem>
              <FacebookIcon />
              <FacebookShare
                url={window.location.href}
                title={`Descubre ${distrito.name} gracias a Destino Ñeembucú!`}
                buttonTitle="Facebook"
                style={REACT_SHARE_BUTTON_STYLES}
                blankTarget={true}
              />
            </ShareableItem>
          </li>
          <li className="text-sm">
            <ShareableItem>
              <TwitterIcon />
              <TwitterShare
                url={window.location.href}
                title={`Descubre ${distrito.name} gracias a Destino Ñeembucú!`}
                buttonTitle="X"
                style={REACT_SHARE_BUTTON_STYLES}
                blankTarget={true}
              />
            </ShareableItem>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}
