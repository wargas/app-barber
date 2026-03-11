import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { formatDate } from 'date-fns'

export function Component() {

    const query = api.orders.list.useQuery()
    
    return (
        <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviços</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Situação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {query.data?.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{formatDate(item.createdAt, 'dd/MM/yyyy hh:mm:ss')}</TableCell>
                            <TableCell>{item.custumer?.name}</TableCell>
                            <TableCell>
                                {item.orderServices.map(s => (
                                    <p>{s.service.name} (R$ {s.price})</p>
                                ))}
                            </TableCell>
                            <TableCell>{item.total}</TableCell>
                            <TableCell>{item.done ? 'FECHADA' : 'ABERTA'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}