import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import type { InputSignin } from "@/types"
import { Spinner } from "./ui/spinner"
import { api } from "@/lib/api"
import { useNavigate } from "react-router"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const navigate = useNavigate()
  const form = useForm<InputSignin>({})

  const { mutateAsync } = api.auth.sigin.useMutation()

  async function handleSubmit(data: InputSignin) {
    try {
      const response = await mutateAsync(data)

      localStorage.setItem('token', response.token)

      navigate('/dashboard')

    } catch (error) {

    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Entrar em sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Informe Email e Senha para entrar
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input {...form.register('email')} />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <Input type="password" {...form.register('password')} />
        </Field>
        <Field>
          <Button type="submit">
            {form.formState.isSubmitting && (
              <Spinner />
            )}
            Entrar
          </Button>
        </Field>

      </FieldGroup>
    </form>
  )
}
