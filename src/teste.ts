import { db } from "./lib/db";
const password = Bun.password.hashSync('wrgs2703')

await db.barber.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.costumer.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.orderService.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.orderPayment.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.orderProduct.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.order.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.product.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.schedule.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})

await db.service.updateMany({
    data: {
        userid: "cmpvm9wbv0000oyjmvsx72ydl"
    }
})
// console.log({password})
// await db.user.create({ data: { name: 'Andre Teixeira', email: 'andre@admin.com', password } })

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