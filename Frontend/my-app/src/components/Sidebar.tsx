interface SiseBarProps{
    handleOpenSideBar:()=>void,
    openSideBar:boolean
}

import { LogOut, X } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
export default function Sidebar({handleOpenSideBar,openSideBar}:SiseBarProps){
     let navigate = useNavigate()

    let handleLogout = ()=>{
         Cookies.remove('token') ;
          navigate('/signin' , {replace:true})
    }
    return(
        <>
          <div className={`min-h-screen w-72 border-r border-gray-200 fixed bg-white p-4 
      transition-transform duration-300
      ${openSideBar ? "translate-x-0" : "-translate-x-full"}  
      md:translate-x-0`}>
             <div className="absolute top-1 right-1 md:hidden "><button onClick={handleOpenSideBar} ><X size={18}/></button></div>
              <button className=" flex items-center justify-center bg-red-500 text-white font-semibold px-2 py-1 gap-2 rounded-md hover:bg-red-600 cursor-pointer" onClick={handleLogout}>Sign Out <LogOut size={20}/></button>
        </div>
        </>
    )
}