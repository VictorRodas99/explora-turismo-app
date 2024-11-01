import { AUTH_INPUTS_NAMES } from '@/constants'
import useForm from '@/hooks/use-form'
import { createUser } from '@/services/client/user'
import { cn } from '@/utils/cn'
import GoogleIcon from '../icons/google'
import { X } from 'lucide-react'

export default function RegisterForm() {
  const { isLoading, formError, handleSubmit, resetFormError } = useForm({
    action: createUser
  })

  const commonOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formError) {
      return
    }

    if (!event.target.value) {
      resetFormError()
    }
  }

  return (
    <form
      className="relative rounded-lg border bg-white shadow-sm mx-auto max-w-sm"
      onSubmit={handleSubmit}
    >
      <div className="absolute top-2 right-2">
        <a href="/" className="hover:text-primary transition-colors">
          <X size={20} />
        </a>
      </div>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold tracking-tight text-xl">Registráte</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese su información para crear su cuenta
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={AUTH_INPUTS_NAMES.name}
              >
                Nombre <span className="text-red-400 text-sm">*</span>
              </label>
              <input
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  { 'border-red-500': Boolean(formError) }
                )}
                id={AUTH_INPUTS_NAMES.name}
                name={AUTH_INPUTS_NAMES.name}
                placeholder="Richard"
                required
                onChange={commonOnChange}
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={AUTH_INPUTS_NAMES.lastname}
              >
                Apellido <span className="text-red-400 text-sm">*</span>
              </label>
              <input
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  { 'border-red-500': Boolean(formError) }
                )}
                id={AUTH_INPUTS_NAMES.lastname}
                name={AUTH_INPUTS_NAMES.lastname}
                placeholder="Robinson"
                required
                onChange={commonOnChange}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={AUTH_INPUTS_NAMES.email}
            >
              Email <span className="text-red-400 text-sm">*</span>
            </label>
            <input
              type="email"
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                { 'border-red-500': Boolean(formError) }
              )}
              id={AUTH_INPUTS_NAMES.email}
              name={AUTH_INPUTS_NAMES.email}
              placeholder="m@ejemplo.com"
              required
              onChange={commonOnChange}
            />
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={AUTH_INPUTS_NAMES.password}
            >
              Contraseña <span className="text-red-400 text-sm">*</span>
            </label>
            <input
              type="password"
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                { 'border-red-500': Boolean(formError) }
              )}
              id={AUTH_INPUTS_NAMES.password}
              name={AUTH_INPUTS_NAMES.password}
              onChange={commonOnChange}
            />
          </div>
          {formError && (
            <span className="text-red-500 text-sm m-auto">
              {formError.message}
            </span>
          )}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-white text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full disabled:bg-primary/50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Registrar'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-300 hover:text-accent-foreground h-10 px-4 py-2 w-full"
          >
            <div className="flex gap-2 items-center justify-center">
              <GoogleIcon size={18} />
              Google
            </div>
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿Ya tiene una cuenta?{' '}
          <a className="underline" href="/login">
            Log in
          </a>
        </div>
      </div>
    </form>
  )
}
