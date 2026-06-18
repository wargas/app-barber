import { confirme } from "@/components/dialog-confirme"
import { InputMoney } from "@/components/input-money"
import { modal } from "@/components/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { api } from "@/lib/api"
import { FormOrderProduct } from "@/modals/form-order-product"
import { FormOrderService } from "@/modals/form-order-service"
import type { RouterInput } from "@/types"
import { sumBy } from "lodash"
import { Check, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { redirect, useNavigate, useParams } from "react-router"
import { toast } from "sonner"

type Input = RouterInput['orders']['close']

export const handle = { title: 'Comanda' }

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
    const products = query.data?.orderProducts || []
    const payments = query.data?.orderPayments || []

    const queryMethods = api.paymentsMethods.list.useQuery()

    const valorTotal = sumBy(services, `price`) + sumBy(products, `total`);

    const paymentsPrev = form.watch(`payment`)

    const valorPago = sumBy(payments, `value`) + sumBy(paymentsPrev, `value`);

    const { mutateAsync: deleteProduct } = api.orders.deleteProduct.useMutation()
    const { mutateAsync: deleteService } = api.orders.deleteService.useMutation()
    const { mutateAsync: deleteOrder } = api.orders.delete.useMutation()
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

    async function addProduct() {
        const response = await modal(FormOrderProduct, { title: `Adicionar Produto`, data: params.id })

        if (response) {
            query.refetch()
        }
    }

    async function deleteServiceHandle(id: string) {
        await deleteService(id);

        query.refetch()
    }

    async function deleteProductHandle(id: string) {
        await deleteProduct(id);

        query.refetch()
    }

    async function submitHandle(data: Input) {
        try {
            await closeOrder(data)
            toast.success(`Comanda fechada com sucesso`)
            navigate('/comandas')
        } catch (error) {
        }
    }

    async function handleDeleteOrder() {
        if (await confirme("Deseja realmente cancelar a comanda?")) {

            toast.promise(deleteOrder(params.id!), {
                loading: "Excluindo comanda",
                success: data => {

                    navigate('/comandas')

                    return "Comanda excluida com sucesso"
                }
            })

        }
    }

    useEffect(() => {
        if (fieldsPayment.fields.length == 0) {
            fieldsPayment.append({ methodId: '', value: 0 })
        }
    }, [fieldsPayment.fields.length])

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex gap-4">
                <Field className="flex-4">
                    <FieldLabel>Cliente</FieldLabel>
                    <Input disabled value={query.data?.custumer?.name} />
                </Field>
                <Field className="flex-1">
                    <FieldLabel>Data</FieldLabel>
                    <Input disabled value={query.data?.createdAt.toLocaleDateString()} />
                </Field>
                <Field className="flex-1">
                    <FieldLabel>Valor Total</FieldLabel>
                    <Input disabled value={(sumBy(services, `price`) + sumBy(products, `total`)).toCurrency()} />
                </Field>
            </div>


            <Separator />

            <Tabs defaultValue="services" className="w-full" variant="underline">
                <TabsList className="w-full bg-card">
                    <TabsTrigger className="flex-1" value="services">Serviços ({sumBy(services, `price`).toCurrency()})</TabsTrigger>
                    <TabsTrigger className="flex-1" value="products">Produtos ({sumBy(products, `total`).toCurrency()})</TabsTrigger>
                    <TabsTrigger className="flex-1" value="payment">
                        Pagamento {` `}
                        {valorPago > 0 && valorPago == valorTotal && <Badge className="bg-green-700 h-4 text-xs">OK</Badge>}
                        {valorTotal > valorPago && <Badge className="bg-yellow-300" variant={`ghost`}>Falta {(valorTotal - valorPago).toCurrency()}</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="services">
                    <Card className="col-span-4">
                        <CardHeader className="border-b">
                            <CardAction>
                                <Button variant={`outline`} onClick={addService} size={'sm'}>
                                    <Plus /> adicionar
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
                                            <TableCell>{item.price.toCurrency()}</TableCell>
                                            <TableCell>
                                                <div className="flex">
                                                    <Button className="ml-auto" onClick={() => deleteServiceHandle(item.id)} variant={'outline'} size={'icon-sm'}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products">
                    <Card className="col-span-4">
                        <CardHeader className="border-b">
                            <CardAction>
                                <Button variant={`outline`} onClick={addProduct} size={'sm'}>
                                    <Plus /> adicionar
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Qtd</TableHead>
                                        <TableHead>Valor Unitario</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell>{item.product.price.toCurrency()}</TableCell>
                                            <TableCell>{(item.qty * item.product.price).toCurrency()}</TableCell>
                                            <TableCell>
                                                <div className="flex">
                                                    <Button className="ml-auto" onClick={() => deleteProductHandle(item.id)} variant={`outline`} size={`icon-xs`}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment">
                    <Card className="col-span-2 row-span-2">
                        {/* <CardHeader>
                            <CardTitle>Pagamento</CardTitle>
                        </CardHeader> */}
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Metodo</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    {payments.map(item => (
                                        <TableRow>
                                            <TableCell>{item.method.name}</TableCell>
                                            <TableCell>{item.value.toCurrency()}</TableCell>
                                            <TableCell>
                                                <div className="flex">
                                                    <Button variant={`outline`} size={`icon-sm`} className="ml-auto">
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

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
                                                <InputMoney className="max-w-44" onChangeValue={e => form.setValue(`payment.${index}.value`, e)} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex">
                                                    <Button className="ml-auto" onClick={() => fieldsPayment.remove(index)} variant={'outline'} size={`icon-sm`}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>
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
                </TabsContent>
            </Tabs>





            <Separator className="col-span-6" />

            <div className="flex gap-4 col-span-6">
                <div className="flex-1 flex gap-4">

                </div>
                <Button type="button" variant={'secondary'} onClick={handleDeleteOrder}>Cancelar comanda</Button>
                <Button disabled={valorPago != valorTotal || query.data?.done} onClick={form.handleSubmit(submitHandle)}>
                    {form.formState.isSubmitting ? <Spinner /> : <Check />}
                    Finalizar comanda</Button>
            </div>

        </div>
    )
}