import { useEffect, useState, type JSX } from "react"
import { EventManager } from "@/lib/events"
import type { ModalItemProps, ModalOptions, ModalPositions, ModalSizes } from "@/components/modal/modal-types"
import { ModalProvider } from "./modal-provider"

export function ContainerModal() {

    const [modals, setModal] = useState<ModalItemProps[]>([])

    useEffect(() => {
        EventManager.on('add-modal', (element: () => JSX.Element, options: ModalOptions, id: string) => {
            setModal(olds => [...olds, {element, options, id}])
        })

        EventManager.on('remove-modal', (id: string) => {
            setModal(olds => olds.filter(m => m.id != id))
        })

        EventManager.on('close-modal', (id: string, data: any) => {
            EventManager.emit(`close-modal:${id}`, data)
        })

        EventManager.on('set-title', function(id: string, title: string) {
            setModal(olds => {
                return olds.map(m => {
                    if(m.id == id) {
                        m.options.title = title
                    }
                    return m;
                })
            })
        })

        EventManager.on('set-size', function(id: string, size: ModalSizes) {
            setModal(olds => {
                return olds.map(m => {
                    if(m.id == id) {
                        m.options.size = size
                    }
                    return m;
                })
            })
        })

        EventManager.on('set-position', function(id: string, position: ModalPositions) {
            setModal(olds => {
                return olds.map(m => {
                    if(m.id == id) {
                        m.options.position = position
                    }
                    return m;
                })
            })
        })

        return () => {
            EventManager.off('add-modal')
            EventManager.off('close-modal')
            EventManager.off('remove-modal')
        }
    }, [])

    return <div>
        {modals.map(({id, element: Element, options}) => (
            <ModalProvider options={options} id={id} key={id}>
                <Element />
            </ModalProvider>
        ))}
    </div>
}