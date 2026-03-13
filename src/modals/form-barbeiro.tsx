import { useModal } from "@/components/modal/hook-modal";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api"
import type { InputCostumersCreate } from "@/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";


export function FormBarbeiro() {
    const modal = useModal()

    const query = api.barbers.show.useQuery(modal.options.data.id, {
        enabled: !!modal.options.data.id,
    })

    const { mutateAsync: create } = api.barbers.create.useMutation()
    const { mutateAsync: update } = api.barbers.update.useMutation()

    const form = useForm<InputCostumersCreate>()

    async function handleSubmit(params: InputCostumersCreate) {
        if (modal.options.data.id) {

            await update({ name: params.name, isActive: true, id: String(modal.options.data.id) })
        } else {
            await create(params)
        }
        modal.close(true)
    }

    useEffect(() => {
        if (query.data?.name) {
            form.setValue('name', query.data.name)
        }
    }, [query.data])

    return <>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-sm p-4">
            <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input {...form.register('name')} />
            </Field>
        </form>
        <DrawerFooter>
            <Button onClick={form.handleSubmit(handleSubmit)}>
                {form.formState.isSubmitting && (
                    <Spinner />
                )}
                {query.isEnabled ? 'Atualizar' : 'Cadastrar' }
            </Button>
        </DrawerFooter>
    </>
}