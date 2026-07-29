import { useState } from "react";
import {toast} from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Login(){

    const dispatch = useDispatch();
   const navigate = useNavigate();


    const [loginData, setloginData]=useState({
        email:"",
        password:"",
        rememberMe:false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleUserInput(e){
        const{name, value, type, checked}=e.target;
        setloginData({
            ...loginData,
            [name]: type === "checkbox" ? checked : value
        })
    }

   async function onLogin(event){
        event.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details ");
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await dispatch(login(loginData));
            if(response?.payload?.success){
                navigate("/");
                setloginData({
                    email:"",
                    password:"",
                    rememberMe:false,
                })
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    return(
        <HomeLayout>
                <div className=" flex items-center justify-center h-[90vh]">
                    <form  noValidate onSubmit={onLogin} className="flex flex-col   justify-center gap-3  rounded-lg text-white p-4  w-80  shadow-[0_0_10px_black] ">
                        <h1 className="text-center text-2xl font-bold">Login Page</h1>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input 
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Enter your email...."
                                className=" bg-transparent px-2 py-1 border"
                                onChange={handleUserInput}
                                value={loginData.email}
                             />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="font-semibold">Password</label>
                            <input 
                                type="password"
                                required
                                name="password"
                                id="password"
                                placeholder="Enter your password...."
                                className=" bg-transparent px-2 py-1 border"
                                onChange={handleUserInput}
                                value={loginData.password}
                             />
                        </div>

                        <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={loginData.rememberMe}
                                onChange={handleUserInput}
                            />
                            <span>Remember me for 30 days</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed py-2 font-semibold text-lg cursor-pointer transition-all ease-in-out duration-300 rounded-sm"
                        >
                                {isSubmitting ? "Logging in..." : "Login"}
                        </button>

                        <Link to={"/forget-password"}>
                            <p className="text-center link text-accent cursor-pointer">
                            Forget Password
                            </p>
                        </Link>
          
                        <p className="text-center">
                         Donot have an account ? <Link to="/signup" className=" link  text-accent cursor-pointer">Signup</Link>
                        </p>

                    </form>
                </div>
        </HomeLayout>
    )
}
export default Login;