import {z} from "zod";

export const userNameValidation=z
    .string()
    .min(2,"minimum two char are required")
    .max(20,"max 20 char are allowded")
    .regex(/^[a-zA-Z]+$/, "no special characters are allowed")
 
export const signUpSchema=z.object({
    username:userNameValidation,
    email:z.string().email({message:"invalid email address"}),
    password:z.string().min(6,{message:"password must be atleast 6 char"})
})
