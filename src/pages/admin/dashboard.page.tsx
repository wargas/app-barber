import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export function Component() {

    const {data: query} = api.dashboard.totais.useQuery()

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            <Card>
                <CardHeader>
                    <CardDescription>Barbeiros</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.barbers}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Serviços</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.servicos}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Comandas hoje</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.orders.count}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Serviços hoje R$</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.orders.value?.toCurrency()}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}