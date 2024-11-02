import { AUTH_INPUTS_NAMES } from '@/constants'
import { loginUser } from '@/services/client/user'
import { cn } from '@/utils/cn'
import useForm from '@/hooks/use-form'
import GoogleIcon from '../icons/google'
import { X } from 'lucide-react'
import { API_STATES } from '@/pages/api/_states'
import { useToast } from '@/hooks/use-toast'
import type React from 'react'
import type { Provider } from '@supabase/supabase-js'

export default function LoginForm() {
  const { isLoading, formError, handleSubmit, resetFormError } = useForm({
    action: loginUser
  })

  const { toast } = useToast()

  const commonOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formError) {
      return
    }

    if (!event.target.value) {
      resetFormError()
    }
  }

  const handleClickOnProviderButton = async (provider: Provider) => {
    const formData = new FormData()
    formData.append('provider', provider)

    const response = await loginUser(formData)

    if (response.status === API_STATES.error) {
      console.error(response.data)

      return toast({
        title: 'Error inesperado en el proveedor de google',
        description: 'Volve a intentar o contacta con el equipo',
        variant: 'destructive'
      })
    }

    const { redirectTo } = response.data

    if (typeof redirectTo === 'string') {
      window.location.replace(redirectTo)
    }
  }

  return (
    <form
      className="relative rounded-lg border bg-white shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="absolute top-2 right-2">
        <a href="/" className="hover:text-primary transition-colors">
          <X size={20} />
        </a>
      </div>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold tracking-tight text-2xl">Login</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese su email para iniciar sesión
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={AUTH_INPUTS_NAMES.email}
            >
              Email <span className="text-red-500 text-sm">*</span>
            </label>
            <input
              type="email"
              id={AUTH_INPUTS_NAMES.email}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                { 'border-red-500': Boolean(formError) }
              )}
              name={AUTH_INPUTS_NAMES.email}
              placeholder="m@ejemplo.com"
              required
              onChange={commonOnChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={AUTH_INPUTS_NAMES.password}
              >
                Contraseña <span className="text-red-500 text-sm">*</span>
              </label>
            </div>
            <input
              type="password"
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                { 'border-red-500': Boolean(formError) }
              )}
              name={AUTH_INPUTS_NAMES.password}
              id={AUTH_INPUTS_NAMES.password}
              required
              onChange={commonOnChange}
            />
            <a className="ml-auto inline-block text-sm underline" href="/">
              ¿Olvidó su contraseña?
            </a>
          </div>
          {formError && (
            <span className="text-red-500 text-sm m-auto">
              {formError.message}
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full disabled:bg-primary/50"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Login'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-300 hover:text-accent-foreground h-10 px-4 py-2 w-full"
            onClick={() => handleClickOnProviderButton('google')}
          >
            <div className="flex gap-2 items-center justify-center">
              <GoogleIcon size={18} />
              Google
            </div>
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿No tiene una cuenta?{' '}
          <a className="underline" href="/register">
            Registráte
          </a>
        </div>
      </div>
    </form>
  )
}
