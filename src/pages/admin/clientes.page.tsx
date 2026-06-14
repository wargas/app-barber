import { modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { FormBarbeiro } from "@/modals/form-barbeiro";
import { FormCliente } from "@/modals/form-cliente";
import { range } from "lodash";

import { Pen, Trash2Icon } from "lucide-react";
import { Activity } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";


export const handle = { title: 'Profissionais' }

export function Component() {

    const [params] = useSearchParams()

    const currentPage = parseInt(params.get('p') ?? '1')

    const query = api.custumers.paginate.useQuery({ page: currentPage })

    const { mutateAsync: deleteCustumer } = api.custumers.delete.useMutation()

    async function openFormCliente(id: string | null = null) {
        const response = await modal(FormCliente, {
            title: 'Salvar Cliente',
            data: { id }
        })

        if (response) {
            query.refetch()
        }
    }

    async function handleDelete(id: string) {

        if (confirm("Confirma a exclusão do cliente")) {

            deleteCustumer(id).then(async () => {
                toast("Excluido com sucesso")
                query.refetch()
            })
        }
    }



    return <div>


        <div className="p-4">
            <Card className="gap-0">
                <CardHeader className="border-b">
                    <CardTitle>Clientes</CardTitle>
                    <CardDescription>Lista os clientes cadastrados ({query.data?.total})</CardDescription>
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
                                <TableHead>Data Cadastro</TableHead>
                                <TableHead></TableHead>
                            </TableRow>

                        </TableHeader>
                        <TableBody>
                            {query.data?.data?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Button size={"icon-sm"} variant={"ghost"} onClick={() => handleDelete(item.id)}>
                                                <Trash2Icon />
                                            </Button>
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
                <CardContent>
                    <Pagination>
                        <PaginationContent>
                            {range(1, query.data?.num_pages ?? 1).map(p => (

                                <PaginationItem key={p}>
                                    <PaginationLink to={`?p=${p}`} isActive={currentPage == p}>
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>

        </div>
    </div>
}