import { useModal } from "@/components/modal/hook-modal";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        const response = await mutation.mutateAsync(data);

        close(true)

        navigate(`/comandas/${response.id}`)
    }

    return <>
        <div className="flex flex-col gap-4 p-4">
            <Field>
                <FieldLabel>Cliente</FieldLabel>
                <Select onValueChange={v => form.setValue('custumerId', v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        {queryClients.data?.map(item => (
                            <SelectItem value={item.id}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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