import { ContainerModal } from "@/components/modal/modal-container";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export function Component() {
    return <>
        <Outlet />
        <ContainerModal />
        <Toaster />
    </>
}