import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2,"Username must be atlest 2 chracters")
.max(20,"Username must be less than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters")

export const signUpShema   = z.object({
username: usernameValidation,
email:z.string().email({message:"Invalid email"}),
password: z.string().min(6,{message:"password must be atleast of 6 characters"})
})