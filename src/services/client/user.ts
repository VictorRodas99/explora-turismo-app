import { API_STATES } from '@/pages/api/_states'
import { apiResponseSchema } from '../validations/api-response.zod'

const AUTH_ROUTES = {
  login: '/api/auth/login',
  register: '/api/auth/register'
}

export async function loginUser(user: FormData) {
  try {
    const response = await fetch(AUTH_ROUTES.login, {
      body: user,
      method: 'POST'
    })

    const jsonResponse = await response.json()
    const parsedResponse = apiResponseSchema.safeParse(jsonResponse)

    if (!parsedResponse.success) {
      console.log(parsedResponse.error)

      throw new Error(
        `
        Error parsing the JSON response while fetching ${AUTH_ROUTES.login}\n
        Received: ${JSON.stringify(jsonResponse, null, 2)}
        `
      )
    }

    const { data: vaildResponse } = parsedResponse.data

    if (!response.ok) {
      return {
        status: vaildResponse.statusText as typeof API_STATES.error,
        data: vaildResponse.data as string
      }
    }

    return {
      status: vaildResponse.statusText as typeof API_STATES.success,
      data: vaildResponse.data
    }
  } catch (error) {
    console.error(error)

    return {
      status: API_STATES.error,
      data: 'Error interno'
    }
  }
}

export async function createUser(user: FormData) {
  try {
    const response = await fetch(AUTH_ROUTES.register, {
      body: user,
      method: 'POST'
    })

    const jsonResponse = await response.json()
    const parsedResponse = apiResponseSchema.safeParse(jsonResponse)

    if (!parsedResponse.success) {
      console.log(parsedResponse.error)

      throw new Error(
        `
        Error parsing the JSON response while fetching ${AUTH_ROUTES.login}\n
        Received: ${JSON.stringify(jsonResponse, null, 2)}
        `
      )
    }

    const { data: vaildResponse } = parsedResponse.data

    if (!response.ok) {
      return {
        status: vaildResponse.statusText as typeof API_STATES.error,
        data: vaildResponse.data as string
      }
    }

    return {
      status: vaildResponse.statusText as typeof API_STATES.success,
      data: vaildResponse.data
    }
  } catch (error) {
    console.error(error)

    return {
      status: API_STATES.error,
      data: 'Error interno'
    }
  }
}
