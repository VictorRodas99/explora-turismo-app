import { useToast } from '@/hooks/use-toast'
import type { Distrito, InterestPoint } from '@/types'
import { ToastAction } from '@/components/toast'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ApiResponse } from '@/services/validations/api-response.zod'
import { API_STATES } from '@/pages/api/_states'

const isFavorite = async ({
  session,
  ...place
}: {
  session: { accessToken: string | null }
  id: number
  type: 'distrito' | 'punto'
}) => {
  if (!session.accessToken) {
    return false
  }

  const response = await fetch('/api/favoritos/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`
    },
    body: JSON.stringify({ placeId: place.id, placeType: place.type })
  })

  const json = (await response.json()) as ApiResponse
  const { statusText, data } = json.data

  if (statusText === API_STATES.error) {
    return false
  }

  return Boolean(data?.isFavorite)
}

export default function SavePlace({
  place,
  session
}: {
  place: (Distrito | InterestPoint) & { type: 'distrito' | 'punto' }
  session: { accessToken: string | null }
}) {
  const [isChecking, setIsChecking] = useState(false)
  const [originalSavedState, setOriginalSavedState] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const showToastToLogin = () => {
    toast({
      title: 'No se pudo guardar el lugar',
      description: 'Debe iniciar sesión',
      action: (
        <ToastAction
          altText="Inicie sesión"
          onClick={() => window.location.replace('/login')}
        >
          Inicie sesión
        </ToastAction>
      )
    })
  }

  const toggleFavorite = async () => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/favoritos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ placeId: place.id, placeType: place.type })
      })

      const { statusText, data } = (await response.json()).data

      if (statusText === API_STATES.error) {
        return setIsSaved(originalSavedState)
      }

      setIsSaved(data?.message === 'saved')
    } catch (error) {
      setIsSaved(originalSavedState)

      toast({
        title: 'Hubo un error al guardar el lugar',
        description: 'Intente de nuevo'
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const check = async () => {
      setIsChecking(true)
      const result = await isFavorite({
        session,
        id: place.id,
        type: place.type
      })
      setIsChecking(false)

      setOriginalSavedState(result)
    }

    check()
  }, [place.id, place.type, session])

  useEffect(() => {
    setIsSaved(originalSavedState)
  }, [originalSavedState])

  if (isChecking) {
    return (
      <div className="p-2 text-sm">
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={session.accessToken ? toggleFavorite : showToastToLogin}
      className="flex gap-2 items-center text-sm p-2 hover:bg-gray-200 hover:rounded-md focus:scale-95 transition-all"
    >
      <Heart size={15} fill={isSaved ? '#34b754' : 'none'} />
      <span className="hidden md:block">
        {' '}
        {isLoading
          ? isSaved
            ? 'Eliminando'
            : 'Guardando'
          : isSaved
            ? 'Guardado'
            : 'Guardar'}{' '}
      </span>
    </button>
  )
}
