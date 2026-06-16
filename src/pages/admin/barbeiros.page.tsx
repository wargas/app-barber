import { confirme } from "@/components/dialog-confirme";
import { modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { FormBarbeiro } from "@/modals/form-barbeiro";

import { Pen, Trash2Icon } from "lucide-react";
import { Activity } from "react";
import { toast } from "sonner";


export const handle = { title: 'Profissionais' }

export function Component() {

    const query = api.barbers.list.useQuery()
    const { mutateAsync: deleteMutation } = api.barbers.delete.useMutation()

    async function openFormBarbeiro(id: string | null = null) {
        const response = await modal(FormBarbeiro, {
            title: 'Salvar Profissional',
            data: { id }
        })

        if (response) {
            query.refetch()
        }
    }

    async function handleDelete(id:string) {

        if(await confirme("Confirma a exclusão do profissional")) {
            
             deleteMutation(id).then(async () => {
                toast("Excluido com sucesso")
                query.refetch()
             })
        }
    }



    return <div>


        <div className="p-4">
            <Card className="gap-0">
                <CardHeader className="border-b">
                    <CardTitle>Profissionais</CardTitle>
                    <CardDescription>Lista os Profissionais cadastrados</CardDescription>
                    <CardAction>
                        <Button variant={'outline'} onClick={() => openFormBarbeiro(null)}>Adicionar</Button>
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
                                        <Button size={"icon-sm"} variant={"ghost"} onClick={() => handleDelete(item.id)}>
                                                <Trash2Icon />
                                            </Button>
                                            <Button onClick={() => openFormBarbeiro(item.id)} size={'icon-sm'} variant={'ghost'}>
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