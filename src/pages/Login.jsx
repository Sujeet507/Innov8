import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";
import Modal from "../components/Modal";

function Login() {
  
  const onChangeHandler = (name, value) => {
    setCredData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [credData, setCredData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook to handle navigation

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credData.email,
      password: credData.password,
    });

    if (error) return toast.error(error.message);

    toast.success("Login Successfull");
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-start flex flex-col items-center">
        <div className="text-3xl text-teal-500 font-semibold text-center">
          Innov8
        </div>

        <div className="login-form rounded-xl bg-white md:w-[400px]">
          <div className="field-wrapper flex flex-col gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-teal-600">Email</legend>
              <input
                type="email"
                className="input w-full border rounded px-5 py-2  bg-white text-black border-[#e2e2e2]"
                value={credData.email}
                placeholder="Enter your email"
                onChange={(e) => onChangeHandler("email", e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-teal-600">
                Password
              </legend>
              <input
                type="password"
                className="input w-full border rounded px-3 py-2 bg-white  text-black border-[#e2e2e2]"
                placeholder="Enter your password"
                value={credData.password}
                onChange={(e) => onChangeHandler("password", e.target.value)}
              />
            </fieldset>
          </div>
          <div className="buttons flex justify-center">
            <button
              className="btn btn-primary w-full bg-teal-500 outline-0 border-0 shadow-none hover:shadow-teal-400 text-white"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
