import type { JSX } from "react"

export type ModalSizes = 'sm'|'md'|'lg'|'xl'|'2xl'|'full'
export type ModalPositions = 'left' | 'right' | 'center'
export type ModalOptions = {
    data?: any
    title?: string
    size?:  ModalSizes
    position?: ModalPositions
}

export type ModalItemProps = {
    element: () => JSX.Element,
    options: ModalOptions
    id: string
}