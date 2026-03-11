import { db } from "./lib/db";
const password = Bun.password.hashSync('wrgs2703')
//await db.user.create({ data: { name: 'Wargas Teixeira', email: 'admin@deltex.com.br', password } })

await db.paymentMethods.createMany({
    data: [
        {
            name: 'PIX'
        },
        {
            name: 'DÉBITO'
        },
        {
            name: 'CRÉDITO'
        },
        {
            name: 'DINHEIRO'
        },
    ]
})