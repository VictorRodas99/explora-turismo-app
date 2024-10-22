import InstagramIcon from '@/components/icons/instagram'
import WrongInfoBreadcrumb from '@/components/wrong-info-breadcrumb'
import type { getPointOfInterestContacts } from '@/services/server/points-of-interest'
import type { InterestPoint } from '@/types'
import { MapPinHouse, Phone } from 'lucide-react'

interface PlaceInfoProps {
  contacts: Awaited<ReturnType<typeof getPointOfInterestContacts>>
  addressReference: InterestPoint['address_reference']
}

export default function PlaceInfo({
  contacts,
  addressReference
}: PlaceInfoProps) {
  if (!contacts && !addressReference) return null

  return (
    <section className="flex flex-col gap-7 py-10 border-b border-gray-300">
      <WrongInfoBreadcrumb>
        Si alguna información es errónea.
      </WrongInfoBreadcrumb>

      <header>
        <h2 className="text-xl font-bold">Información</h2>
      </header>
      <ul className="flex flex-col gap-3 text-sm">
        {contacts?.instagramUser && (
          <li className="flex gap-2 items-center">
            <a href={contacts.instagramUser}>
              <InstagramIcon size={18} />
            </a>
          </li>
        )}
        {contacts?.phoneNumbers.map((number) => (
          <li key={number} className="flex gap-2 items-center">
            <Phone size={18} />
            +595{number}
          </li>
        ))}
        {addressReference && (
          <li className="flex gap-2 items-center">
            <MapPinHouse size={20} />
            {addressReference}
          </li>
        )}
      </ul>
    </section>
  )
}
