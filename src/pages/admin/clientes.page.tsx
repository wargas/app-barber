import { modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { FormBarbeiro } from "@/modals/form-barbeiro";
import { FormCliente } from "@/modals/form-cliente";

import { Pen } from "lucide-react";
import { Activity } from "react";


export const handle = { title: 'Profissionais' }

export function Component() {

    const query = api.custumers.list.useQuery()

    async function openFormCliente(id: string | null = null) {
        const response = await modal(FormCliente, {
            title: 'Salvar Cliente',
            data: { id }
        })

        if (response) {
            query.refetch()
        }
    }



    return <div>


        <div className="p-4">
            <Card className="gap-0">
                <CardHeader className="border-b">
                    <CardTitle>Clientes</CardTitle>
                    <CardDescription>Lista os clientes cadastrados</CardDescription>
                    <CardAction>
                        <Button variant={'outline'} onClick={() => openFormCliente(null)}>Adicionar</Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                    <Activity mode={query.isLoading ? 'visible' : 'hidden'}>
                        <div className="min-h-64 flex justify-center items-center">
                            <Spinner />
                        </div>
                    </Activity>
                    <Table className="mb-0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead></TableHead>
                            </TableRow>

                        </TableHeader>
                        <TableBody>
                            {query.data?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Button onClick={() => openFormCliente(item.id)} size={'icon-sm'} variant={'ghost'}>
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
    </div>
}