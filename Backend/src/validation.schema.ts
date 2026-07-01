import z from 'zod'

 export const signupSchema = z.object({
    username:z.string().trim().min(3 , "Username must be atleast 3 characters"),
    password:z.string().trim().min(8 , "Password must be minimum 8 characters").regex(/[a-z]/ ,'Password should contain a lowercase letter').regex(/[A-Z]/ , "Password Should Contain a uppercase Letter").regex(/[@#$%^&*!]/ ,'Password should Contain a special character ').regex(/[0-9]/, 'Password Should contain a number')
 })


 export const contentSchema= z.object({
   title:z.string({message:"Title is required "}).min(1,"Title is required"),
   link:z.string().url("Please eter a valid url"),
   tags:z.array(z.string(),{message:"Tags must be array of strings "})
 })