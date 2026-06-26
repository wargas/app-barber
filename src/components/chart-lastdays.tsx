import { Bar, BarChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart"
import { api } from "@/lib/api"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ButtonGroup } from "./ui/button-group"
import { Button } from "./ui/button"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";


export function ChartLastDays() {

    const [key, setKey] = useState(`total`)
    const queryDays = api.dashboard.lastDays.useQuery()

    // return <code>{JSON.stringify(queryDays.data)}</code>

    const chartConfig = {
        services: {
            label: "Serviços",
            color: "oklch(0.852 0.199 91.936);",
        },
        products: {
            label: "Produtos",
            color: "oklch(0.852 0.199 91.936);",
        },
        total: {
            label: "Total",
            color: "oklch(0.852 0.199 91.936);",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle>Receitas</CardTitle>
                <CardDescription>Receitas nos últimos 15 dias</CardDescription>
                <CardAction>
                    <ButtonGroup>
                        <Button onClick={() => setKey(`services`)} variant={key == `services` ? `default` : `outline`}>Serviços</Button>
                        <Button onClick={() => setKey(`products`)} variant={key == `products` ? `default` : `outline`}>Vendas</Button>
                        <Button onClick={() => setKey(`total`)} variant={key == `total` ? `default` : `outline`}>Total</Button>
                    </ButtonGroup>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-60 w-full">
                    <BarChart accessibilityLayer data={queryDays.data ?? []}>
                        <XAxis dataKey={`dia`} tickFormatter={(t: string) => ` ${format(`${t} 03:00:00`, `d/M (EEEEEE)`, { locale: ptBR, })}`} tickLine={false} axisLine={false} />
                        <Bar dataKey={key} fill="var(--color-services)" radius={4} />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={l => String(l).split("-").reverse().join("/")} formatter={(v) => parseFloat(String(v)).toCurrency()} />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}