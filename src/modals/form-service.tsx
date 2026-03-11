import { useModal } from "@/components/modal/hook-modal"
import { Button } from "@/components/ui/button"
import { DrawerFooter } from "@/components/ui/drawer"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/api"
import type { InputServicesCreate } from "@/types"
import { useForm } from "react-hook-form"

export function FormService() {
    const { close, options } = useModal()
    const form = useForm<InputServicesCreate>()
    const mutation = api.services.create.useMutation()

    async function handleSubmit(data: InputServicesCreate) {
        const req = await mutation.mutateAsync({
            name: data.name,
            duration: parseInt(String(data.duration)),
            price: parseInt(String(data.price))
        })

        close(req)
    }

    return <>
        <div className="flex flex-col p-4 gap-4">
            <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input {...form.register('name')} />
            </Field>

            <Field>
                <FieldLabel>Duração </FieldLabel>
                <Input {...form.register('duration')} />
                <FieldDescription>Tempo em minutos</FieldDescription>
            </Field>

            <Field>
                <FieldLabel>Preço</FieldLabel>
                <Input {...form.register('price')} />
            </Field>

        </div>
        <DrawerFooter>
            <Button onClick={form.handleSubmit(handleSubmit)}>
                {form.formState.isSubmitting && (
                    <Spinner />
                )}
                Salvar</Button>
        </DrawerFooter>
    </>
}