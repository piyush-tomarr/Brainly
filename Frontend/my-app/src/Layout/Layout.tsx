import { useState } from "react";
import NavBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout(){
  const [openSideBar, setopenSideBar] = useState(false)
  
  const handleOpenSideBar = ()=>{
    setopenSideBar(!openSideBar)
  }
  return (
    <>
      <Sidebar handleOpenSideBar={handleOpenSideBar} openSideBar={openSideBar}/>
       
      <div className="md:ml-72  ">
        <NavBar openSidebar={openSideBar} handleOpenSideBar={handleOpenSideBar}/>
        <Outlet/>
      </div>
    </>
  );
}
