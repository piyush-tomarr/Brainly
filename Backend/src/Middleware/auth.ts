import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export let auth= (req:Request,res:Response,next:NextFunction)=>{
let token:string|undefined  = req.headers.authorization?.split(" ")[1]
if(!token ){
    return res.status(403).json({success:false , message:"Unauthorized , No Token Provided"})
}
try{
let decoded = jwt.verify(token , process.env.JWT_SECRET!)
//@ts-ignore
req.user=decoded
next()
}
catch(error){
return res.status(403).json({success:false , message:"Unauthorized"})
}
}