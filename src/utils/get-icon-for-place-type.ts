import type { InterestPointCategoryEnglish } from '@/types'
import {
  Amphora,
  BedDouble,
  Binoculars,
  Bird,
  Popcorn,
  Utensils
} from 'lucide-react'

export default function getIconForPlaceType({
  type
}: {
  type: InterestPointCategoryEnglish
}) {
  const icons: Record<string, typeof BedDouble> = {
    lodging: BedDouble,
    tourist: Binoculars,
    historical: Amphora,
    cinema: Popcorn,
    gastronomy: Utensils
  }

  return icons[type] ?? Bird
}
