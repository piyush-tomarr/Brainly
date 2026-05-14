import * as mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql2.createPool({
    database:process.env.DB_NAME!,
    host:process.env.DB_HOST!,
    password:process.env.DB_PASSWORD!,
    user:process.env.DB_USER!,
    port:Number(process.env.DB_PORT)

})

export default pool