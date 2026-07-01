import { Outlet, useNavigate } from "react-router-dom";
import cookies from 'js-cookie'
import { useEffect } from "react";




export default function Auth(){
let navigate = useNavigate()

  useEffect(() => {
    let token = cookies.get('token')
    
    if(!token){
        navigate('/signin')
    }
  }, [])
  

    return(
        <>
        <Outlet/>
        </>
    )
}