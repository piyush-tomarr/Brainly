interface Navbar{
    openSidebar:boolean,
    handleOpenSideBar:any
}

import { useState } from "react"
import { Buttons } from "./Buttons"
import { Menu, Share } from "lucide-react"
import CreateContentModal from "./CreateContentModal"

export default function NavBar({handleOpenSideBar}:Navbar){

  const [openModal, setopenModal] = useState(false)
  
  let handleOpenCreateContentModal =()=>{
    setopenModal(!openModal)
  }
    return(
        <>
        <CreateContentModal open={openModal} onclose={handleOpenCreateContentModal}/>
        <div className=" p-4 flex items-center justify-between md:justify-end">
   
   <div className="md:hidden">
    <button onClick={handleOpenSideBar} className="flex items-center justify-center"> <Menu size={18}/></button>
   </div>
   <div className=" flex items-center gap-5">
    <Buttons varient={'primary'} size={'sm'} text={' Create Content'} startIcon={<Share size={16}/>}  onclick={handleOpenCreateContentModal}/>
     <Buttons varient={'secondary'} size={'sm'} text={'Share Brain'} startIcon={<Share size={16}/>}  onclick={()=>{console.log('hello world')}}/>
   </div>
</div>
        </>
    )
}