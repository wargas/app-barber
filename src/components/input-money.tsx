import React from "react"
import { Input } from "./ui/input"

const locale = 'pt-BR';
const currency = 'BRL';
const formatCurrency = (amount: any) => {

    if (!amount) return "0,00"



    return new Intl.NumberFormat(locale, {
        // style: "currency",
        // currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

const parseCurrency = (input: string) => {
    console.log({ input })
    const digits = input.replace(/\D/g, "")
    console.log({ digits })

    if (!digits) return null
    return Number(digits) / 100
}



export const InputMoney = ({ value, onChange, onChangeValue, ...props }: React.ComponentProps<"input"> & { onChangeValue?: (e: number) => void }) => {

    const [displayValue, setDisplayValue] = React.useState(formatCurrency(value))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        const numericValue = parseCurrency(raw)
        const formattedValue = formatCurrency(numericValue)


        setDisplayValue(formattedValue)

        e.target.value = formattedValue;
        onChangeValue?.(numericValue || 0);
        onChange?.(e)
    }

    React.useEffect(() => {
        setDisplayValue(formatCurrency(value))
    }, [value])

    return <Input onChange={handleChange} value={displayValue} {...props} />
}