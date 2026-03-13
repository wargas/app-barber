import { modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { api } from "@/lib/api"
import { FormService } from "@/modals/form-service"
import { Pen } from "lucide-react"
import { Activity } from "react"

export const handle = { title: 'Serviços' }

export function Component() {

    const services = api.services.list.useQuery()

    const handleOpenCreate = async (id: string | null = null) => {
        await modal(FormService, { title: 'Cadastrar Serviço', data: id })

        services.refetch()
    }

    return (
        <div className="p-4">

            <Card className="gap-0">
                <CardHeader className="border-b">
                    <CardTitle>Serviços</CardTitle>
                    <CardDescription>Lista os tipos de serviço</CardDescription>
                    <CardAction>
                        <Button variant={'outline'} onClick={() => handleOpenCreate()}>Adicionar</Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                    <Activity mode={services.isLoading ? 'visible' : 'hidden'}>
                        <div className="min-h-64 flex justify-center items-center">
                            <Spinner />
                        </div>
                    </Activity>
                    <Table className="mb-0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Tempo</TableHead>
                                <TableHead></TableHead>
                            </TableRow>

                        </TableHeader>
                        <TableBody>
                            {services.data?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</TableCell>
                                    <TableCell>{item.duration} min</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Button onClick={() => handleOpenCreate(item.id)} size={'icon-sm'} variant={'ghost'}>
                                                <Pen size={'1px'} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}
