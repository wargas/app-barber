import { useModal } from "@/components/modal/hook-modal"
import { Button } from "@/components/ui/button"
import { DrawerFooter } from "@/components/ui/drawer"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/api"
import type { InputServicesCreate } from "@/types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export function FormService() {
    const { close, options } = useModal()
    const form = useForm<InputServicesCreate>()
    const { mutateAsync: create } = api.services.create.useMutation()
    const { mutateAsync: update } = api.services.update.useMutation()

    const query = api.services.show.useQuery(options.data, {
        enabled: !!options.data
    })

    async function handleSubmit(data: InputServicesCreate) {
        if (options.data) {
            await update({
                id: String(options.data),
                name: data.name,
                duration: parseInt(String(data.duration)),
                price: parseInt(String(data.price))
            })
        } else {
            await create({
                name: data.name,
                duration: parseInt(String(data.duration)),
                price: parseInt(String(data.price))
            })
        }
        close(true)
    }

    useEffect(() => {
        if(query.data?.id) {
            form.setValue('name', query.data.name);
            form.setValue('price', query.data.price);
            form.setValue('duration', query.data.duration);
        }
    }, [query.data])

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