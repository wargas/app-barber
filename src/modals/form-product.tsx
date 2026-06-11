import { InputMoney } from "@/components/input-money"
import { useModal } from "@/components/modal/hook-modal"
import { Button } from "@/components/ui/button"
import { DrawerFooter } from "@/components/ui/drawer"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/api"
import type { InputProductsCreate } from "@/types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export function FormProduct() {
    const { close, options } = useModal()
    const form = useForm<InputProductsCreate>()
    const { mutateAsync: create } = api.products.create.useMutation()
    const { mutateAsync: update } = api.products.update.useMutation()

    const query = api.products.show.useQuery(options.data, {
        enabled: !!options.data
    })

    async function handleSubmit(data: InputProductsCreate) {
        if (options.data) {
            await update({
                id: String(options.data),
                name: data.name,
                qty: parseInt(String(data.qty)),
                price: parseInt(String(data.price))
            })
        } else {
            await create({
                name: data.name,
                qty: parseInt(String(data.qty)),
                price: parseInt(String(data.price))
            })
        }
        close(true)
    }

    useEffect(() => {
        if(query.data?.id) {
            form.setValue('name', query.data.name);
            form.setValue('price', query.data.price);
            form.setValue('qty', query.data.qty);
        }
    }, [query.data])

    return <>
        <div className="flex flex-col p-4 gap-4">
            <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input {...form.register('name')} />
            </Field>

            <Field>
                <FieldLabel>Quantidade </FieldLabel>
                <Input {...form.register('qty')} />
                <FieldDescription>Quantidade em estoque</FieldDescription>
            </Field>

            <Field>
                <FieldLabel>Preço</FieldLabel>
                <InputMoney onChangeValue={e => form.setValue('price', e)} />
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