
import { EventManager } from '@/lib/events'
import uniqueId from 'lodash/uniqueId'
import type { JSX } from 'react'
import type { ModalOptions } from './modal-types'

function modal(element: () => JSX.Element, options?: ModalOptions) {
    return new Promise(accept => {
        const id = uniqueId('modal_')
        EventManager.emit('add-modal', element, options || {}, id)
        
        EventManager.on(`close-modal:${id}`, accept)
    })
}



export { modal}