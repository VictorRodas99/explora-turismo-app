import {
  Computer,
  LogOut,
  Mail,
  Moon,
  Sun,
  User as UserIcon,
  User2,
  PencilLine,
  LayoutDashboard
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/dropdown-menu'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'
import { mapRoleInSpanish } from '@/utils/formatter'
import { useEffect, useMemo, useRef } from 'react'
import { USER_ROLES } from '@/constants'
import blurBackgroundOnScroll from '@/utils/blur-on-scroll'

export default function UserDropdownOptions({
  user,
  role
}: {
  user: User
  role: UserRole
}) {
  const { user_metadata: userMetadata } = user
  const username = useMemo(() => {
    const { firstName, lastname } = userMetadata

    if (!firstName && !lastname) {
      return null
    }

    return `${firstName} ${lastname}`
  }, [userMetadata])

  const roleInSpanish = mapRoleInSpanish(role)
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const { current: dropdownTrigger } = dropdownTriggerRef
    blurBackgroundOnScroll({ element: dropdownTrigger })
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          ref={dropdownTriggerRef}
          className="text-primary p-2 rounded-full border-2 border-primary focus:outline-none hover:bg-primary hover:text-white transition-colors"
        >
          <User2 size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuLabel>{roleInSpanish}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {username && (
            <DropdownMenuItem>
              <UserIcon />
              <span>{username}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Mail />
            <span>{userMetadata?.email}</span>
          </DropdownMenuItem>
          {role === USER_ROLES.viewer ? (
            <DropdownMenuItem>
              <PencilLine />
              <span>Solicitar ser editor</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <LayoutDashboard />
              <a href="/dashboard">Dashboard</a>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Moon />
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Moon />
                  <span>Oscuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sun />
                  <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Computer />
                  <span>Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <a href="/api/auth/logout">Cerrar sesión</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}