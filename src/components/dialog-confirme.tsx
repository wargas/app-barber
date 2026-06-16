import { EventManager } from "@/lib/events"
import uniqueId from "lodash/uniqueId"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { useEffect, useState } from "react"

export const DialogConfirm = () => {
    const [message, setMessage] = useState<string>()
    const [id, setId] = useState<string>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handler = (args: any) => {
            setMessage(args.message)
            setId(args.id)
            setOpen(true)
          }
      
          EventManager.on("add-confirme", handler)
      
          return () => {
            EventManager.off("add-confirme", handler)
          }
    }, [id, message])

    function handleClose(result:boolean) {
        EventManager.emit(`close-confirme:${id}`, result)

        setOpen(false)
    }

    return <AlertDialog open={open}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Atenção</AlertDialogTitle>
                <AlertDialogDescription>{message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleClose(false)}>Não</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleClose(true)}>Sim</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}

export function confirme(message: string) {
    return new Promise(acc => {
        const id = uniqueId('modal_')

        EventManager.emit(`add-confirme`, { message, id });

        EventManager.on(`close-confirme:${id}`, (result: boolean) => {
            acc(result)
        })
    })
}

