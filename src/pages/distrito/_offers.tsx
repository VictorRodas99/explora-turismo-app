import { interestPointCategories } from '@/constants'
import type { InterestPointCategoryEnglish } from '@/types'
import type { getFilteredInterestPoints } from '@/utils/mappers'
import {
  Amphora,
  BedDouble,
  Binoculars,
  Bird,
  Popcorn,
  TicketX,
  Utensils
} from 'lucide-react'
import { useMemo } from 'react'

interface PlacesSectionProps {
  filteredPoints: ReturnType<typeof getFilteredInterestPoints>
}

const getPlaceTypeLabelFor: Record<
  InterestPointCategoryEnglish,
  (amount: number) => string
> = {
  lodging: (amount) =>
    `${amount} ${amount === 1 ? 'lugar' : 'lugares'} de alojamiento`,
  historical: (amount) =>
    `${amount} ${amount === 1 ? 'zona histórica' : 'zonas histórica'}`,
  cinema: (amount) => `${amount} ${amount === 1 ? 'cine' : 'cines'}`,
  tourist: (amount) =>
    `${amount} ${amount === 1 ? 'zona turística' : 'zona turística'}`,
  gastronomy: (amount) =>
    `${amount} ${amount === 1 ? 'comedor/restaurante' : 'comedores/restaurantes'}`,
  other: (_amount) => ''
}

const getIconForPlaceType = ({
  type
}: {
  type: InterestPointCategoryEnglish
}) => {
  const icons: Record<string, typeof BedDouble> = {
    lodging: BedDouble,
    tourist: Binoculars,
    historical: Amphora,
    cinema: Popcorn,
    gastronomy: Utensils
  }

  return icons[type] ?? Bird
}

function PlaceItem({
  type,
  amount
}: {
  type: InterestPointCategoryEnglish
  amount: number
}) {
  if (amount === 0) {
    return null
  }

  const Icon = getIconForPlaceType({ type })
  const placeLabel = useMemo(
    () => getPlaceTypeLabelFor[type](amount),
    [amount, type]
  )

  return (
    <li className="flex gap-5 items-center">
      <Icon size={25} />
      {placeLabel}
    </li>
  )
}

export default function PlacesSection({ filteredPoints }: PlacesSectionProps) {
  const pointTypeAmount = useMemo(() => {
    const categories = Object.keys(interestPointCategories)

    //@ts-ignore
    const pointTypeAmount: Record<InterestPointCategoryEnglish, number> = {}

    for (const category of categories) {
      pointTypeAmount[category as InterestPointCategoryEnglish] =
        filteredPoints[category as InterestPointCategoryEnglish].length
    }

    return pointTypeAmount
  }, [filteredPoints])

  const hasZeroPlaces = useMemo(
    () => Object.values(pointTypeAmount).every((amount) => amount === 0),
    [pointTypeAmount]
  )

  if (hasZeroPlaces) {
    return (
      <h4 className="font-bold text-xl flex gap-5 items-center">
        <span>
          <TicketX size={25} />
        </span>
        Por el momento no hay lugares disponibles {':('}
      </h4>
    )
  }

  return (
    <>
      <header>
        <h4 className="font-bold text-xl">¿Qué ofrece este lugar?</h4>
      </header>
      <ul className="flex flex-col gap-5">
        {Object.entries(pointTypeAmount).map(([placeType, amount]) => (
          <PlaceItem
            key={`place-item-${placeType}`}
            type={placeType as InterestPointCategoryEnglish}
            amount={amount}
          />
        ))}
      </ul>
    </>
  )
}
