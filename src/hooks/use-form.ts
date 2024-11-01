import { API_STATES } from '@/pages/api/_states'
import type { createUser } from '@/services/client/user'
import { useState, type FormEvent } from 'react'

export default function useForm({
  action,
  redirect = true
}: {
  action: (formData: FormData) => ReturnType<typeof createUser>
  redirect?: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<{
    message: string
  }>()
  const [isSuccessful, setIsSuccessful] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { target: formElement } = event

    if (!(formElement instanceof HTMLFormElement)) {
      return console.error(
        'EVENT ERROR: Expected target to be instance of HTMLFormElement'
      )
    }

    const formData = new FormData(formElement)

    setIsLoading(true)
    const response = await action(formData)

    if (response.status === API_STATES.error) {
      setFormError({ message: response.data })
    }

    setIsLoading(false)

    if (redirect && response.status === API_STATES.success) {
      window.location.replace('/')
    }

    const { redirectTo } = response.data

    if (redirectTo && response.status === API_STATES.success) {
      window.location.replace(redirectTo as string)
    }

    if (!redirect && !formError) {
      setIsSuccessful(true)
      formElement.reset()
    }
  }

  const resetFormError = () => {
    setFormError(undefined)
  }

  return {
    isLoading,
    formError,
    isSuccessful,
    handleSubmit,
    resetFormError
  }
}
