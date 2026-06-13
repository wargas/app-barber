import { modal } from "@/components/modal"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { api } from "@/lib/api"
import { FormComanda } from "@/modals/form-comanda"
import { formatDate } from 'date-fns'
import type { size } from "lodash"
import { Plus, Search, Trash } from "lucide-react"
import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { success } from "zod"

export const handle = { title: 'Comandas' }

export function Component() {
    const navigate = useNavigate()

    const locate = useLocation()

    const { mutateAsync: deleteOrder } = api.orders.delete.useMutation()


    const searchData = useMemo(() => {
        const search = new URLSearchParams(locate.search)

        if (!search.has('start')) {
            search.set('start', formatDate(new Date(), 'yyyy-MM-dd'))
        }

        if (!search.has('end')) {
            search.set('end', formatDate(new Date(), 'yyyy-MM-dd'))
        }

        return search;

    }, [locate.search])

    const query = api.orders.list.useQuery({
        start: searchData.get('start') ?? formatDate(new Date(), 'yyyy-MM-dd'),
        end: searchData.get('end') ?? formatDate(new Date(), 'yyyy-MM-dd'),
        status: searchData.get('status') as 'abertas' ?? 'abertas'
    })

    const total = useMemo(() => {
        return query.data?.reduce((acc, item) => {
            return acc + item.total
        }, 0)
    }, [query.data])

    function setSearch(key: string, value: string) {
        const search = new URLSearchParams(locate.search)

        search.set(key, value);

        navigate(`/comandas?${search.toString()}`)
    }

    async function criarComanda() {
        await modal(FormComanda, { title: 'Nova comanda' })
    }

    async function handleDeleteOrder(id: string) {
        if (confirm("Deseja realmente excluir a comanda?")) {

            toast.promise(deleteOrder(id!), {
                loading: "Excluindo comanda",
                success: (data) => {
                    query.refetch()
                    return `Comanda excluida com sucesso`
                },
            }
            )


        }
    }

    return (
        <div className="p-4">

            <Card>
                <CardHeader className="border-b">
                    <CardAction>
                        <div className="flex gap-4">
                            <Input value={searchData.get('start') ?? ''} onChange={v => setSearch('start', v.target.value)} type="date" />
                            <Input value={searchData.get('end') ?? ''} onChange={v => setSearch('end', v.target.value)} type="date" />
                            <ToggleGroup value={searchData.get('status') ?? 'abertas'} onValueChange={v => setSearch('status', v)} variant={'outline'} type="single">
                                <ToggleGroupItem value="abertas">Abertas</ToggleGroupItem>
                                <ToggleGroupItem value="fechadas">Fechadas</ToggleGroupItem>
                                <ToggleGroupItem value="todas">Todas</ToggleGroupItem>
                            </ToggleGroup>
                            <Button onClick={criarComanda}><Plus />Nova Comanda</Button>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Serviços</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Situação</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {query.data?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{formatDate(item.createdAt, 'dd/MM/yyyy hh:mm:ss')}</TableCell>
                                    <TableCell>{item.custumer?.name}</TableCell>
                                    <TableCell>
                                        {item.orderServices.map(s => (
                                            <p key={s.id}>{s.service.name} ({s.price.toCurrency()})</p>
                                        ))}
                                    </TableCell>
                                    <TableCell>{item.total.toCurrency()}</TableCell>
                                    <TableCell>{item.done ? 'FECHADA' : 'ABERTA'}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={() => navigate(`/comandas/${item.id}`)} variant={'outline'} size={'icon-sm'}>
                                                <Search />
                                            </Button>
                                            <Button onClick={() => handleDeleteOrder(item.id)} variant={`outline`} size={`icon-sm`}>
                                                <Trash />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableHead colSpan={3}>Total do período</TableHead>
                                <TableCell>{total?.toCurrency()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}