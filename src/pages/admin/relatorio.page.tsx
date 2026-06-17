import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { format, startOfMonth } from "date-fns"
import { sumBy } from "lodash"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router"

export const handle = { title: 'Relatório' }

type FormInput = {
    start: string,
    end: string,
    barberId: string,
    serviceId: string
}

export function Component() {

    const [params, setParams] = useSearchParams()

    const defaultValues = {
        start: params.get(`start`)?.toString() ?? ``,
        end: params.get(`end`)?.toString() ?? ``,
        barberId: params.get(`barberId`)?.toString() ?? ``,
        serviceId: params.get(`serviceId`)?.toString() ?? ``,
    }

    if (defaultValues.start.length == 0) {
        defaultValues.start = format(startOfMonth(new Date()), `yyyy-MM-dd`)
    }

    if (defaultValues.end.length == 0) {
        defaultValues.end = format(new Date(), `yyyy-MM-dd`)
    }

    const form = useForm<FormInput>({
        defaultValues
    })

    const query = api.orders.listOrderSevices.useQuery(defaultValues)
    const queryProfissionais = api.barbers.list.useQuery()
    const queryServices = api.services.list.useQuery()

    function handleSubmit(input: FormInput) {
        setParams(input)
    }

    const formValues = form.watch()

    const selectedBarber = useMemo(() => {
        return queryProfissionais.data?.find(q => q.id == formValues.barberId) ?? null
    }, [formValues, queryProfissionais])

    const selectedService = useMemo(() => {
        return queryServices.data?.find(q => q.id == formValues.serviceId) ?? null
    }, [formValues, queryServices])

    return <div className="p-4">
        <Card>
            <CardHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4">
                    <Field>
                        <FieldLabel>Inicio</FieldLabel>
                        <Input {...form.register(`start`)} type="date" />
                    </Field>
                    <Field>
                        <FieldLabel>Fim</FieldLabel>
                        <Input {...form.register(`end`)} type="date" />
                    </Field>
                    <Field>
                        <FieldLabel>Profissional</FieldLabel>
                        <Combobox
                            value={selectedBarber}
                            onValueChange={v => form.setValue(`barberId`, v?.id ?? ``)}
                            items={queryProfissionais.data}
                            itemToStringValue={(i: any) => i.id}
                            itemToStringLabel={(i: any) => i.name}>
                            <ComboboxInput showClear placeholder="Todos" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {item => (
                                        <ComboboxItem value={item}>{item.name}</ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    <Field>
                        <FieldLabel>Serviço</FieldLabel>
                        <Combobox value={selectedService} onValueChange={v => form.setValue(`serviceId`, v?.id ?? ``)} items={queryServices.data} itemToStringValue={(i: any) => i.id} itemToStringLabel={(i: any) => i.name}>

                            <ComboboxInput showClear placeholder="Todos" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {item => (
                                        <ComboboxItem value={item}>{item.name}</ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    <Field>
                        <FieldLabel>&nbsp;</FieldLabel>
                        <Button type="submit" variant={`outline`}>
                            {query.isFetching && <Spinner />}
                            Filtrar</Button>
                    </Field>
                </form>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>DATA</TableHead>
                            <TableHead>PROFISSIONAL</TableHead>
                            <TableHead>SERVIÇO</TableHead>
                            <TableHead>CLIENTE</TableHead>
                            <TableHead className="text-end">VALOR</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {query.data?.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{format(item.createdAt, `dd/MM/yyyy HH:mm`)}</TableCell>
                                <TableCell>{item.barber.name}</TableCell>
                                <TableCell>{item.service.name}</TableCell>
                                <TableCell>{item.custumer?.name}</TableCell>
                                <TableCell className="text-end">{item.price.toCurrency()}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>

                            </TableCell>
                            <TableHead className="text-end">
                                {sumBy(query.data, `price`).toCurrency()}
                            </TableHead>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    </div>
}