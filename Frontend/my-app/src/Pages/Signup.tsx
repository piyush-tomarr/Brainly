import axios from "axios";
import { AtSign, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import {baseUrl} from "../Apis/Api"
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie'
interface Colors {
  primary: string;
  secondary: string;
}

export default function Signup() {
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [confirmPasswordtext, setconfirmPasswordtext] = useState(false)
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const navigate = useNavigate()

  const colors: Colors = {
    primary: "#5046e4",
    secondary: "#e0e7fe",
  };

 const SubmitHandeler = async(e:any)=>{
    e.preventDefault()
    setconfirmPasswordtext(false)
  if(password !== confirmPassword){
    setconfirmPasswordtext(true)
    return
  }
  let Payload = {
    username:username,
    password:password
  }
  try{
     let response = await axios.post(`${baseUrl}/api/v1/signup`,Payload)
     if(response.status===200){
        console.log(response.data.token)
        cookies.set('token',response.data.token , {expires:1})
        navigate('/')
        
     }
  }
  catch(error){
    console.log(error)
  }



 }
  return (
    <>
      <div className="h-screen w-full  flex justify-center items-center">
        <div className="md:h-[50%] h-[90%] md:w-[50%] w-[90%] flex shadow-md">
          <div className="h-full w-full md:w-[50%] bg-white p-4">
            <div>
              <h1 className=" font-semibold text-2xl">
                Welcome to{" "}
                <span className={`text-[${colors.primary}]`}>Brainly</span>
              </h1>
              <p className="text-xs mt-2 text-gray-400">
                Your Second Brain won't let you forget your revisits
              </p>
            </div>

            <div className="mt-10">
              <form action="" className="flex flex-col gap-5" onSubmit={SubmitHandeler}>
                <div className="flex flex-col">
                  <label htmlFor="username" className=" text-lg font-semibold">
                    Username
                  </label>
                  <div className="outline outline-gray-300 w-[80%] text-sm px-2 py-1 rounded-sm flex items-center justify-start gap-2">
                    <AtSign size={13} />
                    <input
                      type="text"
                      className="outline-none"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e)=>{setusername(e.target.value)}}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Password" className=" text-lg font-semibold">
                    Password
                  </label>
                  <div className="outline outline-gray-300 w-[80%] text-sm px-2 py-1 rounded-sm flex items-center justify-start gap-2 relative">
                    <LockKeyhole size={13} />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="outline-none"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e)=>{setpassword(e.target.value)}}
                    />
                    <div className="flex items-center  absolute right-2">
                      <button
                        type="button"
                        onClick={() => {
                          setshowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>

                    
                  </div>
                  
                </div>


                <div className="flex flex-col">
                  <label htmlFor="Password" className=" text-lg font-semibold">
                   Confirm Password
                  </label>
                  <div className="outline outline-gray-300 w-[80%] text-sm px-2 py-1 rounded-sm flex items-center justify-start gap-2 relative">
                    <LockKeyhole size={13} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="outline-none"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e)=>{setconfirmPassword(e.target.value)}}
                    />
                    <div className="flex items-center  absolute right-2">
                      <button
                        type="button"
                        onClick={() => {
                          setshowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                  {confirmPasswordtext && <p className="text-xs mt-2 text-red-600">Password Doesn't match</p>}
                </div>
                <button className={`bg-[${colors.primary}] px-2 py-1 rounded-sm text-white mx-5 cursor-pointer hover:bg-blue-600`} >Submit</button>
              </form>

                <h1 className=" text-center pt-5 text-blue-700">Already have an account? <span className="text-red-600 font-semibold cursor-pointer" onClick={()=>{navigate('/signin')}}>Signin</span></h1>
            </div>
          </div>
          <div className="w-[50%] h-full hidden md:block overflow-hidden">
            <img src="/banner.png" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </>
  );
}
