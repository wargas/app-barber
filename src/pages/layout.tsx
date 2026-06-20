import { DialogConfirm } from "@/components/dialog-confirme";
import { ContainerModal } from "@/components/modal/modal-container";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { useDarkMode } from "usehooks-ts";

export function Component() {

    const { isDarkMode } = useDarkMode()

    useEffect(() => {
        if(isDarkMode) {
            return document.body.classList.add(`dark`)
        }

        document.body.classList.remove(`dark`)
    }, [isDarkMode])

    return <>
        <Outlet />
        <ContainerModal />
        <DialogConfirm />
        <Toaster />
    </>
}