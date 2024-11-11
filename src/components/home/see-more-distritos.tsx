import { API_STATES, DEFAULT_API_LIMIT_FOR } from '@/pages/api/_states'
import { truncateText } from '@/utils/formatter'
import { useRef, useState } from 'react'
import type { Distrito } from '@/types'
import { motion } from 'framer-motion'
import Loader from '../icons/loader'
import { useToast } from '@/hooks/use-toast'

async function fetchMoreDistritos({
  page,
  endpoint
}: {
  page: number
  endpoint?: string
}) {
  if (typeof page !== 'number' || Number.isNaN(page)) {
    throw new Error('Page param must be of type number')
  }

  const url = endpoint ?? '/api/distritos'

  try {
    const response = await fetch(`${url}?page=${page}`)
    const jsonApiResponse = await response.json()

    if (jsonApiResponse.data.statusText !== API_STATES.success) {
      return null
    }

    const distritos = jsonApiResponse.data.data as Distrito[]

    return distritos.map((distrito) => ({
      ...distrito,
      description: truncateText(distrito.description, { maxWords: 15 })
    }))
  } catch (error) {
    console.error(error)
    return null
  }
}

interface SeeMoreButtonProps {
  existsNextPage?: boolean
  updateDistritos: (newDistritos: Distrito[]) => void
  endpoint?: string
}

export default function SeeMoreDistritosButton({
  existsNextPage,
  updateDistritos,
  endpoint
}: SeeMoreButtonProps) {
  const currentPage = useRef(1)

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isNullResponse, setIsNullResponse] = useState(false)

  const getMoreDistritos = async () => {
    currentPage.current++

    setIsLoading(true)
    const distritos = await fetchMoreDistritos({
      page: currentPage.current,
      endpoint
    })
    setIsLoading(false)

    if (!distritos || distritos?.length === 0) {
      return toast({
        title: 'Hubo un error al cargar los siguientes distritos',
        variant: 'destructive'
      })
    }

    if (distritos.length < DEFAULT_API_LIMIT_FOR.distritos) {
      setIsNullResponse(true)
    }

    updateDistritos(distritos)
  }

  return isNullResponse || existsNextPage ? null : (
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
