import { useModal } from "@/components/modal/hook-modal";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { InputSchedulesCreate } from "@/types";
import { useForm } from "react-hook-form";

type FormInput = {
    client: string,
    serviceId: string,
    barberId: string,
    startDate: string,
    startTime: string
}

export function FormSchedule() {
    const modal = useModal()

    const { data: services } = api.services.list.useQuery()
    const { data: barbers } = api.barbers.list.useQuery()

    const { mutateAsync: createSchedule } = api.schedules.create.useMutation()

    const form = useForm<FormInput>()

    async function handleSubmit(input: FormInput) {
        const created = await createSchedule({
            start: new Date(`${input.startDate} ${input.startTime}:00`),
            barberId: input.barberId,
            serviceId: input.serviceId,
            client: input.client
        })

        console.log({created})

        modal.close(created)
    }

    return <>
        <form id="form-schedule" className="p-4 flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>

        <Field>
                <FieldLabel>Nome do cliente</FieldLabel>
                <Select>
                    <Input type="text" {...form.register("client")} />
                </Select>
            </Field>
            <Field>
                <FieldLabel>Serviço</FieldLabel>
                <Select defaultValue="1" onValueChange={v => form.setValue("serviceId", v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                        {services?.map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel>Data</FieldLabel>
                <Select>
                    <Input {...form.register("startDate")} defaultValue={`2026-06-11`}  />
                </Select>
            </Field>

            <Field>
                <FieldLabel>Hora</FieldLabel>
                <Select>
                    <Input type="time" {...form.register("startTime")} />
                </Select>
            </Field>

            <Field>
                <FieldLabel>Profissional</FieldLabel>
                <Select defaultValue="1" onValueChange={v => form.setValue("barberId", v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                        {barbers?.map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

        </form>
        <DrawerFooter>
            <Button form="form-schedule">
                {form.formState.isSubmitting && (
                    <Spinner />
                )}
                Salvar agendamento</Button>
        </DrawerFooter>
    </>
}