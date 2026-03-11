import { api } from "@/lib/api";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar'
import { NavUser } from "@/components/nav-user";
import { IconCirclePlusFilled, IconDashboard, IconInnerShadowTop, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PersonStanding, ScissorsIcon, ShoppingBag, User2, UserCheck, UserCircle } from "lucide-react";
import { modal } from "@/components/modal";
import { FormComanda } from "@/modals/form-comanda";

export function Component() {

    const location = useLocation()
    const navigate = useNavigate()
    const user = api.auth.me.useQuery()


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }

        if (user.isLoading) return;

        if (!user.data) {
            navigate('/login')
        }


    }, [location.pathname, user.isLoading])

    if (user.isLoading) {
        return <div>Carregando</div>
    }

    async function criarComanda() {
        await modal(FormComanda, { title: 'Nova comanda'})
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <Sidebar collapsible="offcanvas">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className="data-[slot=sidebar-menu-button]:p-1.5!"
                            >
                                <button >
                                    <IconInnerShadowTop className="size-5!" />
                                    <span className="text-base font-semibold">Acme Inc.</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-2">
                            <SidebarMenu>
                                <SidebarMenuItem className="flex items-center gap-2">
                                    <SidebarMenuButton asChild
                                        tooltip="Quick Create"
                                        className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                    >
                                        <button onClick={criarComanda}>
                                            <IconCirclePlusFilled />
                                            <span>COMANDA</span>
                                        </button>
                                    </SidebarMenuButton>
                                    {/* <Button
                                        size="icon"
                                        className="size-8 group-data-[collapsible=icon]:opacity-0"
                                        variant="outline"
                                    >
                                        <IconMail />
                                        <span className="sr-only">Inbox</span>
                                    </Button> */}
                                </SidebarMenuItem>
                            </SidebarMenu>
                            <SidebarMenu>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="dashboard">
                                        <Link to={'/dashboard'}>
                                            <IconDashboard />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="barbeiros" asChild>
                                        <Link to={'/comandas'}>
                                            <ShoppingBag />
                                            <span>Comandas</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="barbeiros" asChild>
                                        <Link to={'/barbeiros'}>
                                            <UserCircle />
                                            <span>Barbeiros</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="barbeiros">
                                        <Link to={'/clientes'}>
                                            <UserCheck />
                                            <span>Clientes</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="barbeiros" asChild>
                                        <Link to={'/servicos'}>
                                            <ScissorsIcon />
                                            <span>Serviços</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={user.data!} />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}