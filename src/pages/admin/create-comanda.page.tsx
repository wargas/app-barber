import { modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { FormOrderService } from "@/modals/form-order-service"
import type { RouterInput } from "@/types"
import { Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

type Input = RouterInput['orders']['close']


export function Component() {
    const params = useParams<{ id: string }>()
    const navigate = useNavigate()

    const form = useForm<Input>({
        defaultValues: {
            id: params.id!
        }
    })
    const fieldsPayment = useFieldArray({ control: form.control, name: 'payment' })

    const query = api.orders.show.useQuery(params.id!)
    const services = query.data?.orderServices || []

    const queryMethods = api.paymentsMethods.list.useQuery()

    const { mutateAsync: deleteService } = api.orders.deleteService.useMutation()
    const { mutateAsync: closeOrder } = api.orders.close.useMutation({
        onError(error) {
            toast.error(error.message)
        }
    })

    async function addService() {
        const response = await modal(FormOrderService, { title: 'Adicionar Serviço', data: params.id })

        if (response) {
            query.refetch()
        }
    }

    async function deleteServiceHandle(id: string) {
        await deleteService(id);

        query.refetch()
    }

    async function submitHandle(data: Input) {
        try {
            await closeOrder({ ...data, payment: data.payment.map(i => ({ ...i, value: parseFloat(i.value.toString()) })) })
            toast.success(`Comanda fechada com sucesso`)
            navigate('/comandas')
        } catch (error) {
        }
    }

    useEffect(() => {
        if (fieldsPayment.fields.length == 0) {
            fieldsPayment.append({ methodId: '', value: 0 })
        }
    }, [fieldsPayment.fields.length])

    return (
        <div className="p-4 grid grid-cols-6 gap-4">
            <Field className="col-span-5">
                <FieldLabel>Cliente</FieldLabel>
                <Input disabled value={query.data?.custumer?.name} />
            </Field>
            <Field>
                <FieldLabel>Data</FieldLabel>
                <Input disabled value={query.data?.createdAt.toLocaleDateString()} />
            </Field>
            <Card className="col-span-3">
                <CardHeader className="border-b">
                    <CardTitle>Serviços</CardTitle>
                    <CardAction>
                        <Button onClick={addService} size={'icon-sm'}>
                            <Plus />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Profissional</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.service.name}</TableCell>
                                    <TableCell>{item.barber.name}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => deleteServiceHandle(item.id)} variant={'ghost'} size={'icon-sm'}>
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metodo</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fieldsPayment.fields.map((field, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Select onValueChange={v => form.setValue(`payment.${index}.methodId`, v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="credito">Selecione</SelectItem>
                                                {queryMethods.data?.map(item => (
                                                    <SelectItem value={item.id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input {...form.register(`payment.${index}.value`)} />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => fieldsPayment.remove(index)} variant={'outline'}>-</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-center">
                        <Button variant={'secondary'} onClick={() => fieldsPayment.append({ methodId: '', value: 0 })}>adicionar</Button>
                    </div>

                </CardContent>
            </Card>

            <Separator className="col-span-6" />
            
            <div className="flex gap-4 col-span-6">
                <div className="flex-1 flex gap-4">
                    <span>
                    Valor Total: 15
                    </span>
                    <span>
                    Valor Pago: 15
                    </span>
                </div>
                <Button variant={'secondary'} onClick={form.handleSubmit(submitHandle)}>Cancelar comanda</Button>
                <Button loading={form.formState.isSubmitting} onClick={form.handleSubmit(submitHandle)}>Finalizar comanda</Button>
            </div>

        </div>
    )
}