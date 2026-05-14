import { Interface } from 'node:readline'
import pool from './db.js'
import bcrypt from 'bcrypt'
import type  {RowDataPacket} from 'mysql2'
import jwt from 'jsonwebtoken'
import type { PoolConnection } from 'mysql2/promise'




//Signup functions
export let userExists = async(username:string)=>{
    let query = 'SELECT * FROM users  WHERE username = ?'
    let [rows] = await pool.query(query , [username])
    return rows
}

export let hashPassword = async(password:string)=>{
let saltrounds:number = 10

let hashedPassword = await bcrypt.hash(password , saltrounds)
return hashedPassword
}


export let insertNewUser = async(username:string,password:string)=>{
    let query  = "INSERT INTO users (username,PASSWORD) VALUES(?,?)"
    await pool.query(query,[username,password])
}




//Signin Functions
interface Users extends RowDataPacket {
    id:number,
    username:string,
    password:string
}
export let getUsers = async(username:string):Promise<Users[]>=>{
    let query = 'SELECT * FROM users WHERE username = ?'
    let [rows]= await pool.query<Users[]>(query , [username])
    return rows
}


export let createJWT = async(id:number)=>{
 let token = jwt.sign(
    {id},
    process.env.JWT_SECRET as string , 
    {expiresIn: "1d"}
 )
 return token

}



//post content Functions 
export let insertContent= async(conn:PoolConnection,title:string, link:string, userId:number)=>{
   let query:string = 'INSERT INTO content (title,link,user_id) VALUES(?,?,?)'
  await  conn.query(query,[title,link,userId])
}

export let insertTags=async(conn:PoolConnection,tags:string[])=>{
let query:string='INSERT IGNORE INTO tags (NAME) VALUES(?)'

for(let  i =0 ; i<tags.length; i++){
   await conn.query(query,[tags[i]])
}

}


export let getContentId = async(conn:PoolConnection,title:string,link:string)=>{
    let query:string='SELECT id FROM content WHERE title = ? AND link=?'
    let [rows]:any= await conn.query(query,[title,link])
    return rows[0].id
}

export let getTagId = async(conn:PoolConnection ,tags:string[])=>{
    let query:string = 'SELECT id FROM tags WHERE NAME IN (?)'
    
    let [rows]:any = await conn.query(query,[tags]) 

   let ids:number[] = []
    for(let i = 0 ; i <rows.length ; i++){
        ids.push(rows[i].id)
    }
    return ids
}


export let insertContentTags = async(conn:PoolConnection,tagIds:number[] , contentId:number)=>{
    let query:string = "INSERT IGNORE INTO content_tags (content_id , tag_id) VALUES(?,?)"

    for(let i = 0 ; i <tagIds.length ; i++){
        await conn.query(query , [contentId , tagIds[i]])
    }
}




//get content function


export let getContent = async(id:number)=>{
let query:string ="SELECT c.id, c.title ,c.link,t.name AS tags FROM content c LEFT JOIN content_tags ct ON c.id = ct.content_id LEFT JOIN tags t ON ct.tag_id = t.id WHERE c.user_id=?"

let [rows] = await pool.query<RowDataPacket[]>(query,[id])
let map = new Map()

for(let row of rows){
   if(!map.has(row.id)){
    map.set(row.id , {
        id:row.id,
        title:row.title,
        link:row.link,
        tags: new Set()
    })
   }

   if(row.tags){
    map.get(row.id).tags.add(row.tags)
   }
}

const result = Array.from(map.values()).map(item => ({
  ...item,
  tags: Array.from(item.tags)
}))

return result

}

//delete brain service

export let deleteBrain = async(id:number)=>{
 let query = 'DELETE FROM content WHERE id=?'
 let [rows]= await pool.query<RowDataPacket[]>(query,[id])
 console.log(rows)
 return rows
}
