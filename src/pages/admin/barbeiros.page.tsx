import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { InputCostumersCreate } from "@/types";
import { useForm } from "react-hook-form";

export function Component() {

    const form = useForm<InputCostumersCreate>()
    const { mutateAsync } = api.barbers.create.useMutation()

    async function handleSubmit(params: InputCostumersCreate) {
        await mutateAsync(params)
    }

    return <div className="p-4">
        <h1>BARBEIROS</h1>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-sm">
            <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input {...form.register('name')} />
            </Field>
            <div className="mt-4">
                <Button type="submit">
                    {form.formState.isSubmitting && (
                        <Spinner />
                    )}
                    Cadastrar
                </Button>
            </div>
        </form>
    </div>
}