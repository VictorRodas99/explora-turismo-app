import { API_STATES, DEFAULT_API_LIMIT_FOR } from '@/pages/api/_states'
import { truncateText } from '@/utils/formatter'
import { useRef, useState } from 'react'
import type { Distrito } from '@/types'
import { motion } from 'framer-motion'
import Loader from '../icons/loader'

async function fetchMoreDistritos({ page }: { page: number }) {
  if (typeof page !== 'number' || Number.isNaN(page)) {
    throw new Error('Page param must be of type number')
  }

  const response = await fetch(`/api/distritos?page=${page}`)
  const jsonApiResponse = await response.json()

  if (jsonApiResponse.data.statusText !== API_STATES.success) {
    // TODO: add toast for not found cases
    return null
  }

  const distritos = jsonApiResponse.data.data as Distrito[]

  return distritos.map((distrito) => ({
    ...distrito,
    description: truncateText(distrito.description, { maxWords: 15 })
  }))
}

interface SeeMoreButtonProps {
  updateDistritos: (newDistritos: Distrito[]) => void
}

export default function SeeMoreDistritosButton({
  updateDistritos
}: SeeMoreButtonProps) {
  const currentPage = useRef(1)

  const [isLoading, setIsLoading] = useState(false)
  const [isNullResponse, setIsNullResponse] = useState(false)

  const getMoreDistritos = async () => {
    currentPage.current++

    setIsLoading(true)
    const distritos = await fetchMoreDistritos({ page: currentPage.current })
    setIsLoading(false)

    if (!distritos || distritos?.length === 0) {
      return
    }

    if (distritos.length < DEFAULT_API_LIMIT_FOR.distritos) {
      setIsNullResponse(true)
    }

    updateDistritos(distritos)
  }

  return isNullResponse ? null : (
    <button
      type="button"
      className="relative text-sm h-10 bg-primary border border-primary rounded-md text-white hover:bg-primary/90 p-2 transition-colors"
      disabled={isLoading}
      onClick={getMoreDistritos}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 0 : 1,
          y: isLoading ? -30 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        Ver más distritos
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 1 : 0,
          scale: isLoading ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Loader className="w-6 h-6 animate-spin" />
      </motion.div>
      <span className="sr-only">
        {isLoading ? 'Loading' : 'Ver más distritos'}
      </span>
    </button>
  )
}
