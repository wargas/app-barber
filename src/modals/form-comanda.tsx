import { useModal } from "@/components/modal/hook-modal";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { RouterInput } from "@/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

type InputOrder = RouterInput['orders']['create']

export function FormComanda() {

    const { close } = useModal()

    const navigate = useNavigate()
    const queryClients = api.custumers.list.useQuery()
    const mutation = api.orders.create.useMutation()

    const form = useForm<InputOrder>()

    async function handleSubmit(data: InputOrder) {
        if (!data.custumerId) return;
        const response = await mutation.mutateAsync(data);

        close(true)

        navigate(`/comandas/${response.id}`)
    }

    return <>
        <div className="flex flex-col gap-4 p-4">
            <Field>
                <FieldLabel>Cliente</FieldLabel>
                <Combobox autoHighlight items={queryClients.data} onValueChange={(v: any) => form.setValue(`custumerId`, v?.id)} itemToStringValue={(i: any) => i?.id} itemToStringLabel={(i: any) => i?.name}>
                    <ComboboxInput placeholder="Selecione um cliente" showClear showTrigger />
                    <ComboboxContent>
                        <ComboboxEmpty>Nenhum cliente encontrado</ComboboxEmpty>
                        <ComboboxList>
                            {(item: any) => (
                                <ComboboxItem key={item.id} value={item}>{item.name.trim()}</ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>
        </div>
        <DrawerFooter>
            <Button onClick={form.handleSubmit(handleSubmit)}>
                {form.formState.isSubmitting && (
                    <Spinner />
                )}
                Criar comanda</Button>
        </DrawerFooter>
    </>
}