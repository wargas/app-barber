import { ChartLastDays } from "@/components/chart-lastdays";
import { confirme } from "@/components/dialog-confirme";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { add, endOfMonth, endOfWeek, endOfYear, format, isAfter, parse, startOfMonth, startOfWeek, startOfYear, sub } from "date-fns";
import { now } from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

const tipos = [
    { label: `Dia`, value: `dia` },
    { label: `Semana`, value: `semana` },
    { label: `Mês`, value: `mes` },
    { label: `Ano`, value: `ano` },
]

export function Component() {
    const [search, setSearch] = useSearchParams()

    const selectedTipo = search.get(`t`) ?? `dia`
    const selectedStart = search.get(`s`) ?? format(now(), `yyyy-MM-dd`)

    const interval = useMemo(() => {
        var start = parse(selectedStart, `yyyy-MM-dd`, new Date());
        var end = parse(selectedStart, `yyyy-MM-dd`, new Date());

        if (selectedTipo == `mes`) {
            start = startOfMonth(start);
            end = sub(endOfMonth(start), { hours: 3 })
        }

        if (selectedTipo == `semana`) {
            start = startOfWeek(start);
            end = sub(endOfWeek(start), { hours: 3 })
        }

        if (selectedTipo == `ano`) {
            start = startOfYear(start);
            end = sub(endOfYear(start), { hours: 3 })
        }

        if (isAfter(end, now())) {
            end = new Date()
        }

        return [start, end]
    }, [selectedTipo, selectedStart])

    const intervalText = useMemo(() => {
        if (selectedTipo == `ano`) return interval[0]?.getFullYear();

        if (selectedTipo == `mes`) return format(interval[0]!, `MM/yyyy`);

        if (selectedTipo == `semana`) {
            return format(interval[0]!, `dd`) + ` a ` + format(interval[1]!, `dd/MM/yyyy`)
        }

        return format(interval[0]!, `dd/MM/yyyy`);
    }, [interval, selectedTipo])

    const { data: query } = api.dashboard.totais.useQuery({
        start: format(interval[0]!, `yyyy-MM-dd`),
        end: format(interval[1]!, `yyyy-MM-dd`),
    })

    function handlePrev() {
        const currentDate = parse(selectedStart, `yyyy-MM-dd`, new Date());

        let prevDate = sub(currentDate, { days: 1 })

        if (selectedTipo == `semana`) {
            prevDate = sub(currentDate, { weeks: 1 })
        }

        if (selectedTipo == `mes`) {
            prevDate = sub(currentDate, { months: 1 })
        }

        if (selectedTipo == `ano`) {
            prevDate = sub(currentDate, { years: 1 })
        }


        setSearch({ s: format(prevDate, `yyyy-MM-dd`), t: selectedTipo })
    }

    function handleNext() {
        const currentDate = parse(selectedStart, `yyyy-MM-dd`, new Date());

        let prevDate = add(currentDate, { days: 1 })

        if (selectedTipo == `semana`) {
            prevDate = add(currentDate, { weeks: 1 })
        }

        if (selectedTipo == `mes`) {
            prevDate = add(currentDate, { months: 1 })
        }

        if (selectedTipo == `ano`) {
            prevDate = add(currentDate, { years: 1 })
        }

        setSearch({ s: format(prevDate, `yyyy-MM-dd`), t: selectedTipo })
    }

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            <div className="col-span-4 flex justify-between">
                <Button onClick={() => confirme(`Quer fazer isso mesmo`).then(console.log)}>TESTE</Button>
                <ButtonGroup>
                    <Button onClick={handlePrev} variant={`outline`}><ChevronLeft /></Button>
                    <Button onClick={handleNext} variant={`outline`}><ChevronRight /></Button>
                    <ButtonGroupSeparator />
                    <Button variant={`outline`}>{intervalText}</Button>
                </ButtonGroup>
                <ButtonGroup>
                    {tipos.map(tipo => (
                        <Button onClick={() => setSearch({ t: tipo.value })} variant={tipo.value == selectedTipo ? `default` : `outline`}>{tipo.label}</Button>

                    ))}
                </ButtonGroup>
            </div>
            <Card>
                <CardHeader>
                    <CardDescription>Barbeiros</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.barbers}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Serviços Cadastrados</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.servicos}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Numero de Comandas</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{query?.orders.count}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Receita R$</CardDescription>
                    <CardTitle className="text-4xl font-semibold">{(query?.orders.value ?? 0).toCurrency()}</CardTitle>
                </CardHeader>
            </Card>

            <div className="col-span-4">
                <ChartLastDays />
            </div>
        </div>
    )
}