import { confirme } from "@/components/dialog-confirme"
import { modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { api } from "@/lib/api"
import { FormProduct } from "@/modals/form-product"
import { Pen, Trash2Icon } from "lucide-react"
import { Activity } from "react"
import { toast } from "sonner"

export const handle = { title: 'Produtos' }

export function Component() {

    const services = api.products.list.useQuery()
    const { mutateAsync: deleteMutation } = api.products.delete.useMutation()


    const handleOpenCreate = async (id: string | null = null) => {
        await modal(FormProduct, { title: 'Cadastrar Produto', data: id })

        services.refetch()
    }


    async function handleDelete(id:string) {

        if(await confirme("Confirma a exclusão do produto")) {
            
             deleteMutation(id).then(async () => {
                toast("Excluido com sucesso")
                services.refetch()
             })
        }
    }

    return (
        <div className="p-4">

            <Card className="gap-0">
                <CardHeader className="border-b">
                    <CardTitle>Produtos</CardTitle>
                    <CardDescription>Lista os tipos de produtos</CardDescription>
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
                                <TableHead>Qtd</TableHead>
                                <TableHead></TableHead>
                            </TableRow>

                        </TableHeader>
                        <TableBody>
                            {services.data?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                        <Button size={"icon-sm"} variant={"ghost"} onClick={() => handleDelete(item.id)}>
                                                <Trash2Icon />
                                            </Button>
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
