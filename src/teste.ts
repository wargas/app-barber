import { db } from "./lib/db";
const password = Bun.password.hashSync('12345678')
await db.user.create({ data: { name: 'Andre Teixeira', email: 'andre@admin.com', password } })

// await db.paymentMethods.createMany({
//     data: [
//         {
//             name: 'PIX'
//         },
//         {
//             name: 'DÉBITO'
//         },
//         {
//             name: 'CRÉDITO'
//         },
//         {
//             name: 'DINHEIRO'
//         },
//     ]
// })
// console.log(
//     Bun.SHA256.hash('admin@deltex', 'hex')
// )