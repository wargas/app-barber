import { api } from "@/lib/api";
import { useEffect, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation, useMatch, useMatches, useNavigate, type MiddlewareFunction } from "react-router";
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
import { Badge, Check, ChevronRight, FileText, LucideWatch, PersonStanding, ScissorsIcon, ShoppingBag, ShoppingBasket, User2, UserCheck, UserCircle } from "lucide-react";
import { modal } from "@/components/modal";
import { FormComanda } from "@/modals/form-comanda";
import { SiteHeader } from "@/components/site-header";
import _ from "lodash";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Chevron } from "react-day-picker";

const menuItems = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: IconDashboard,
        tooltip: "painel de controle",
    },
    {
        title: "Comandas",
        to: "/comandas",
        icon: ShoppingBag,
        tooltip: "comandas",
    },
    {
        title: "Profissionais",
        to: "/barbeiros",
        icon: UserCircle,
        tooltip: "barbeiros",
    },
    {
        title: "Clientes",
        to: "/clientes",
        icon: UserCheck,
        tooltip: "clientes",
    },
    {
        title: "Serviços",
        to: "/servicos",
        icon: ScissorsIcon,
        tooltip: "serviços",
    },
    {
        title: "Produtos",
        to: "/produtos",
        icon: ShoppingBasket,
        tooltip: "produtos",
    },
    {
        title: "Agendamentos",
        to: "/agenda",
        icon: LucideWatch,
        tooltip: "agenda",
    },
    {
        title: "Relatórios",
        to: "/relatorio",
        icon: FileText,
        tooltip: "relatório",
    },
]


export function Component() {

    const location = useLocation()
    const navigate = useNavigate()
    const user = api.auth.me.useQuery()
    const match = useMatches()

    const title = useMemo(() => {
        const route = match.findLast(m => _.has(m, 'handle.title'));

        if (!route) return '';

        return _.get(route, 'handle.title') as string;
    }, [match])

    useEffect(() => {
        if (user.isLoading) return;

        if (!user.data) {
            navigate('/login')
        }


    }, [location.pathname, user.isLoading])

    if (user.isLoading) {
        return <div>Carregando</div>
    }

    async function criarComanda() {
        await modal(FormComanda, { title: 'Nova comanda' })
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
                <SidebarHeader className="border-b bg-background">
                    <Item size={`sm`}>
                        <ItemMedia>
                            <img className="w-8" src="https://fino-barbearia-sys.lovable.app/assets/logo-andre-barbearia-Ca6LAyk_.jpeg" alt="" />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>ANDRE</ItemTitle>
                            <ItemDescription>Barbearia</ItemDescription>
                        </ItemContent>
                    </Item>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-2">

                            <SidebarMenu>
                                <SidebarMenuItem className="flex items-center gap-2">
                                    <SidebarMenuButton asChild
                                        tooltip="Criar Rápido"
                                        className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                    >
                                        <button onClick={criarComanda}>
                                            <IconCirclePlusFilled />
                                            <span>COMANDA</span>
                                        </button>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            </SidebarMenu>



                            <SidebarMenu>
                                {menuItems.map(item => (

                                    <SidebarMenuItem key={item.to}>
                                        <SidebarMenuButton isActive={location.pathname.startsWith(item.to)} asChild tooltip={item.tooltip}>
                                            <Link to={item.to}>
                                                <item.icon />
                                                <span className="flex-1">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                               

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={user.data!} />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <SiteHeader title={title} />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}