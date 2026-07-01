import { Routes,Route } from "react-router-dom"
import Home from './Pages/Home'
import Layout from "./Layout/Layout"
import Signup from "./Pages/Signup"
import Auth from "./Auth/Auth"
import Signin from "./Pages/Signin"
import { ToastContainer } from "react-toastify"

const App = () => {

  return (
   
  <>


  <Routes>

    
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route element={<Auth/>}>
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
    </Route>
    </Route>
  </Routes>
  <ToastContainer position="top-right" autoClose={1500}/>
  </>
  )
}

export default App