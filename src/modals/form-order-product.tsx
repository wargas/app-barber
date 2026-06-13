import { useModal } from "@/components/modal/hook-modal";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type InputForm = {
    productId: string
    qty: number
    orderId: string
}

export function FormOrderProduct() {

    const modal = useModal()

    const queryProducts = api.products.list.useQuery()
    const { mutateAsync } = api.orders.addProduct.useMutation()

    const form = useForm<InputForm>({
        defaultValues: {
            orderId: modal.options.data,
            qty: 1
        }
    })

    async function handleSubmit(input: InputForm) {
        try {
            const request = mutateAsync({...input, qty: parseInt(String(input.qty))})

            modal.close(request)
        } catch (error) {
            toast.error(`Erro ao adicionar produto`)
        }


    }


    return <>
        <form id="product-order-form" onSubmit={form.handleSubmit(handleSubmit)} className="p-4 flex flex-col gap-4">
            <input type="hidden" {...form.register(`orderId`)} />
            <Field>
                <FieldLabel>Produto</FieldLabel>
                <Combobox onValueChange={v => form.setValue(`productId`, v.id)} items={queryProducts.data} itemToStringLabel={(i: any) => i.name} itemToStringValue={(i: any) => i.id}>
                    <ComboboxInput showClear placeholder="Indique o produto" />
                    <ComboboxContent>
                        <ComboboxEmpty>Nenhum produto encontrado</ComboboxEmpty>
                        <ComboboxList>

                            {(item: any) => (
                                <ComboboxItem key={item.id} value={item}>{item.name}</ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>
            <Field>
                <FieldLabel>Quantidade:</FieldLabel>
                <Input {...form.register(`qty`)} type="number" />
            </Field>
        </form>
        <DrawerFooter>
            <Button type="submit" form="product-order-form">
                {form.formState.isSubmitting && <Spinner /> }
                Adicionar Produto
            </Button>
        </DrawerFooter>
    </>
}