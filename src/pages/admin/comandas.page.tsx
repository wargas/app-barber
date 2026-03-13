import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { formatDate } from 'date-fns'
import { Search } from "lucide-react"
import { useNavigate } from "react-router"

export const handle = { title: 'Comandas' }

export function Component() {
    const navigate = useNavigate()
    const query = api.orders.list.useQuery()

    return (
        <div className="">

            <div className="p-4">

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
                                    <Button onClick={() => navigate(`/comandas/${item.id}`)} variant={'outline'} size={'icon-sm'}>
                                            <Search />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}