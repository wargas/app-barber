import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scissors, MapPin, Clock, Star } from "lucide-react"

export function Component() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#7c2d12,transparent_35%)]" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center">
                    <div>
                        <Badge className="mb-6 bg-amber-600 hover:bg-amber-600">
                            André Barbearia
                        </Badge>

                        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                            Estilo, precisão e tradição no corte
                        </h1>

                        <p className="mt-6 max-w-xl text-lg text-zinc-300">
                            Cabelo, barba e acabamento com profissionais especializados.
                            Agende seu horário e tenha uma experiência completa de barbearia.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                                Agendar horário
                            </Button>

                            <Button size="lg" variant="outline" className="border-zinc-700 bg-transparent">
                                Ver serviços
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200"
                            alt="Barbearia"
                            className="h-105 w-full rounded-2xl object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold md:text-4xl">Nossos serviços</h2>
                    <p className="mt-3 text-zinc-400">
                        Tudo para manter seu visual sempre em dia.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Corte Degradê tradicional",
                            price: "R$ 35",
                            text: "Corte moderno ou clássico com acabamento profissional.",
                        },
                        {
                            title: "Corte Social tradicional",
                            price: "R$ 30",
                            text: "Toalha quente, navalha e hidratação para barba.",
                        },
                        {
                            title: "Corte Degradê navalhado",
                            price: "R$ 35",
                            text: "Cabelo, barba e finalização em uma experiência premium.",
                        },
                    ].map((item) => (
                        <Card key={item.title} className="border-zinc-800 bg-zinc-900 text-white">
                            <CardContent className="p-6">
                                <Scissors className="mb-5 h-10 w-10 text-amber-500" />
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="mt-3 text-zinc-400">{item.text}</p>
                                <p className="mt-6 text-2xl font-bold text-amber-500">
                                    {item.price}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-zinc-900">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
                    <div className="flex gap-4">
                        <MapPin className="h-8 w-8 text-amber-500" />
                        <div>
                            <h3 className="font-semibold">Localização</h3>
                            <p className="text-zinc-400">Av. Lili Amorim, José e Maria (depois da praça da Amizade)</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Clock className="h-8 w-8 text-amber-500" />
                        <div>
                            <h3 className="font-semibold">Funcionamento</h3>
                            <p className="text-zinc-400">Dom, Seg, ter, qui, sex e Sáb, 08h às 19h</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Star className="h-8 w-8 text-amber-500" />
                        <div>
                            <h3 className="font-semibold">Avaliação</h3>
                            <p className="text-zinc-400">4.9 no Google</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-6 py-24 text-center">
                <h2 className="text-3xl font-bold md:text-5xl">
                    Pronto para renovar o visual?
                </h2>

                <p className="mt-5 text-zinc-400">
                    Agende agora pelo WhatsApp e garanta seu horário.
                </p>

                <Button size="lg" className="mt-8 bg-amber-600 hover:bg-amber-700" asChild>
                    <a href="https://wa.me/5587988318727" target="_blank">
                        Chamar no WhatsApp
                    </a>
                </Button>
            </section>
        </main>
    )
}