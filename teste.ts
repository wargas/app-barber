import { db } from "@/lib/db";

const data = await db.orderProduct.findMany()

console.log({data})