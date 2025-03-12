import { useEffect } from "react";

import {useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate(); // Hook to handle navigation


  async function checkAdmin(){
    const { data, error } = await supabase.auth.getUser();
    console.log({ data, error });

    if(error){
        navigate("/login")
    }
  }

  useEffect(() => {

    checkAdmin();
    
  }, []);

  return children;
};

export default ProtectedRoute;
