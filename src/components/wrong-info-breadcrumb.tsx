import { MAINTAINER_EMAIL } from '@/constants'
import type { ReactNode } from 'react'

export default function WrongInfoBreadcrumb({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className="p-2 bg-gray-100 rounded-lg text-sm">
      {children}
      <a
        href={`mailto:${MAINTAINER_EMAIL}?subject=Informe de Error`}
        className="underline font-bold"
      >
        Contáctenos
      </a>
    </div>
  )
}
