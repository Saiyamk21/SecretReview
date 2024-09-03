import {z} from "zod";

export const MessageSchema=z.object({
    content:z
    .string()
    .min(10,{message:"xcontent must be of 10 char"})
    .max(300,{message:"should not be greater than 300 char"})
})