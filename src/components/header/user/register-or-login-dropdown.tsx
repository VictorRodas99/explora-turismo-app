import { User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/dropdown-menu'

export default function RegisterOrLoginDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-primary p-2 rounded-full border-2 border-primary focus:outline-none hover:bg-primary hover:text-white transition-colors"
        >
          <User size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a href="/login">Iniciar Sesión</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/register">Registrate</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
