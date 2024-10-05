import { API_STATES } from '../_states'

export const createErrorResponse = ({
  errorMessage,
  responseStatus
}: {
  errorMessage: string
  responseStatus: number
}) => {
  if (typeof errorMessage !== 'string' || typeof responseStatus !== 'number') {
    throw new Error('PARAM ERROR: Expected properly types for params')
  }

  return new Response(
    JSON.stringify({
      data: { statusText: API_STATES.error, data: errorMessage }
    }),
    {
      status: responseStatus,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }
  )
}

export const createSucessResponse = <T>({
  responseStatus,
  data
}: {
  responseStatus: number
  data?: T
}) => {
  if (typeof responseStatus !== 'number' || Number.isNaN(responseStatus)) {
    throw new Error(
      `PARAM ERROR: Expected properly typed status, got "${responseStatus}"`
    )
  }

  return new Response(
    JSON.stringify({
      data: { statusText: API_STATES.success, data }
    }),
    {
      status: responseStatus,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }
  )
}