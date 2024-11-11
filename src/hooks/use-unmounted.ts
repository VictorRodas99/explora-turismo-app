import { useEffect, useRef } from 'react'

export default function useUnmounted(effect: () => void) {
  const callbackReference = useRef(effect)

  if (typeof effect !== 'function') {
    throw new Error('Effect must be of type function')
  }

  useEffect(() => {
    callbackReference.current = effect
  }, [effect])

  useEffect(() => {
    return () => {
      callbackReference.current()
    }
  }, [])
}
