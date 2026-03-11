import { modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { api } from "@/lib/api"
import { FormService } from "@/modals/form-service"

export function Component() {

    const services = api.services.list.useQuery()

    const handleOpenCreate = async () => {
        await modal(FormService, { title: 'Cadastrar Serviço', data: 1 })
    }

    return (
        <div className="p-4">

            <div>
                <Button onClick={handleOpenCreate}>Adicionar</Button>
            </div>

            {services.data?.map(item => (
                <Item key={item.id}>
                    <ItemContent>
                        <ItemTitle>{item.name}</ItemTitle>
                        <ItemDescription className="flex gap-4">
                           <span> R$ {item.price}</span>
                            <span>{item.duration} min</span>
                        </ItemDescription>
                    </ItemContent>
                </Item>
            ))}

        </div>
    )
}