import { InputMoney } from "@/components/input-money";
import { useModal } from "@/components/modal/hook-modal"
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { RouterInput } from "@/types";
import { useForm } from "react-hook-form";

type Input = RouterInput['orders']['addService']

export function FormOrderService() {
    const { options, close } = useModal()

    const form = useForm<Input>()

    const orderId = options.data as string;

    const queryServices = api.services.list.useQuery()
    const services = queryServices.data || []

    const queryBarbers = api.barbers.list.useQuery()
    const barbers = queryBarbers.data || []

    const mutation = api.orders.addService.useMutation()

    function onChangeService(id: string) {
        form.setValue('serviceId', id)

        const value = services.find(s => s.id == id)?.price

        if (value) {
            form.setValue('price', value)
        }
    }

    async function handleSubmit(data: Input) {
        await mutation.mutateAsync({
            ...data,
            orderId
        })

        close(true)
    }

    return <>
        <div className="p-4 flex flex-col gap-4">
            <Field>
                <FieldLabel>Serviço</FieldLabel>
                <Select onValueChange={onChangeService}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map(item => (
                            <SelectItem value={item.id} key={item.id}>{item.name} {item.price}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel>Profissional</FieldLabel>
                <Select onValueChange={v => form.setValue('barberId', v)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {barbers.map(item => (
                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel>Preço</FieldLabel>
                <InputMoney onChangeValue={e => form.setValue('price', e)} />
            </Field>

            <Field>
                <FieldLabel>Observação</FieldLabel>
                <Input {...form.register('description')} />
            </Field>
        </div>
        <DrawerFooter>
            <Button onClick={form.handleSubmit(handleSubmit)} loading={form.formState.isSubmitting}>Adicionar</Button>
        </DrawerFooter>
    </>
}