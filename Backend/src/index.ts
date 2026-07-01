import express, { type Request, type Response } from 'express'
import pool from './db.js'
import { contentSchema, signupSchema } from './validation.schema.js'
import { checkExistingHash, createJWT, deleteBrain, deleteLink, getContent, getContentId, getTagId, getuserIdfromLinks, getUsers, hashPassword, insertContent, insertContentTags, insertLink, insertNewUser, insertTags, searchTag, userExists } from './servicefunctions.js'
import morgan from 'morgan'
import bcrypt from 'bcrypt'
import { auth } from './Middleware/auth.js'
import { createHash } from './Utils/Hash.js'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())



app.post('/api/v1/signup', async(req,res)=>{
    let result = signupSchema.safeParse(req.body)
    if(!result.success) return res.status(400).json({success:false , message:result.error.issues[0]?.message})
 
    let {username,password} = result.data
      
    try{
       let existingUser:any = await userExists(username)
       if(existingUser.length>0){
        return res.status(411).json({success:false , message:' A user already exists with this username'})
       }
       let hashedPass = await hashPassword(password)

       await insertNewUser(username , hashedPass)
       let users = await getUsers(username)
        let user = users[0]
        if (!user)  return res.status(400).json({ success: false,  message: "Error Generating JWT" });
       let token = await createJWT(user.id)
       return res.status(200).json({success:true ,message:"Signed Up Successfully", token:token})
 
    }
    catch(error){
        console.log(error)
     return res.status(500).json({success:false , message:"Internal Server Error"})
    }
    
    
})




app.post('/api/v1/signin' , async(req,res)=>{
    let {username, password} = req.body
    try{
      let users = await getUsers(username)
       
      if(users.length===0) return res.status(400).json({success:false , message:"No user found with following credentials"})
      
     let user = users[0]
     if (!user)  return res.status(400).json({ success: false,  message: "No user found" });

     let passCheck =await bcrypt.compare(password , user?.password)

     if(!passCheck) return res.status(403).json({success:false , message:"Invalid Credentials"})

     let token = await createJWT(user.id)

     return res.status(200).json({success:true ,message:"Signed In Successfully", token:token})

    }
    catch(error){
        console.log(error)
      return res.status(500).json({success:false , message:"Internal Server Error"})
    }


})




app.post('/api/v1/content',auth,async(req:Request,res:Response)=>{
    let result = contentSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({success:false  , message:result.error.issues[0]?.message})
    }
    let {title, link,tags}=result.data
    //@ts-ignore
    let {id}=req.user

    if(!id){
        return res.status(400).json({success:false, message:"userId not found"})
    }

    console.log(id)
 
     let conn
    try{
        conn = await pool.getConnection()
        await conn.beginTransaction()
        await insertContent( conn ,title,link,id)
       if(tags){

         await insertTags(conn,tags)

        let contentId = await getContentId(conn,title,link)

        let tagids:number[] = await getTagId(conn,tags)

        await insertContentTags(conn,tagids,contentId)
       }
        await conn.commit()
       return res.status(200).json({success:true , message:"Brain Addes Successfully"})
    }
    catch(error){
        if(conn) await conn.rollback()
       console.log(error)
       return res.status(500).json({success:false , message:'Internal server error'})
    }
    finally{
        conn?.release()
    }

})




app.get('/api/v1/content' ,auth, async (req:Request,res:Response)=>{
    //@ts-ignore
    let {id} = req.user
    console.log(id)
    if(!id){
        return res.status(400).json({success:false , message:"There was some error getting the id "})
    }

    try{
      let data = await getContent(id)
      return res.status(200).json({success:true , respose:data})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false , message:"internal server error"})
    }
})




app.delete('/api/v1/content/:id' ,auth, async(req:Request , res:Response)=>{
    let {id} = req.params
    //@ts-ignore
    let user_id = req.user.id as number
    if(!id) return res.status(403).json({success:false , message:"id is required"})

    if(Array.isArray(id)) return res.status(400).json({success:false , message:" invalid id"})
    
   try{
    let result =  await deleteBrain(parseInt(id),user_id)
    //@ts-ignore
     if(result.affectedRows===0){
        return res.status(404).json({success:false , message:"Brain not found"})
     }
      return res.status(200).json({success:false , message:"Brain Deleted Successfully"})
   }
   catch(error){
    console.log(error)
    return res.status(500).json({success:false , message:"Internal Server Error"})
   }

})





app.post('api/v1/brain/share',auth,async(req:Request,res:Response)=>{
    //@ts-ignore
let {id}= req.user
if(!id) return res.status(400).json({success:false , message:"Unable to fetch Id "})

let {share} = req.body
try{

let hash= await createHash(10)

let hashExists = await checkExistingHash(id)
if(hashExists.length>0){
       return res.status(200).json({success:true  ,hash:hash})
}

if(share){
    await insertLink(id,hash)
    return res.status(200).json({success:true  ,hash:hash})
}
else{
   await  deleteLink(id)
   return res.status(200).json({success:true , message:"Link Hash Deleted Successfully"})
}
}
catch(error){
    console.log(error)
return res.status(500).json({success:false , message:"Internal server error"})
}

})




app.get('api/v1/brain/:shareLink', async(req:Request,res:Response)=>{
    let sharelink = req.params.shareLink as string
if(!sharelink) return res.status(400).json({success:false , message:"No shareLink Found"})
 try{
let userId =await getuserIdfromLinks(sharelink)
let content = await getContent(userId)
return res.status(200).json({success:true , data:content})
}
catch(error){
    console.log(error)
    return res.status(500).json({success:false , message:"Internal Server Error"})
}
})


app.get('/api/v1/tags/search',async(req:Request , res:Response)=>{
    let {q} = req.query
    if(!q || typeof(q)!=='string') return res.status(400).json({success:false , message:'request query is required'})
    
    let trimmed = q.trim()
    if(trimmed.length<=0) return res.status(400).json({success:false , message:"please enter a tag to get suggestions"})
     
        try{
          let data = await searchTag(trimmed)
          if(!data) return res.status(204).json({success:false , message:"no data found "})
          return res.status(200).json({success:true , data:data})
        }
        catch(error){
         console.log(error)
         return res.status(500).json({success:false , message:"internal server error"})
        }

    })





app.listen(2020  , ()=>console.log("Server Running on port 2020"))