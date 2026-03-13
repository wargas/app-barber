import { modal } from "@/components/modal";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { FormBarbeiro } from "@/modals/form-barbeiro";

import { Pen, PenTool } from "lucide-react";
import { Activity } from "react";
import { useForm } from "react-hook-form";


export const handle = { title: 'Profissionais' }

export function Component() {

    const query = api.barbers.list.useQuery()

    async function openFormBarbeiro(id: string | null = null) {
        const response = await modal(FormBarbeiro, {
            title: 'Salvar Profissional',
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