import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Logout({logout}){

  const navigate = useNavigate();

  useEffect(()=>{
    const datos = sessionStorage.getItem("datos");
    if(datos != null){
      logout();
      sessionStorage.clear();
    }
    return navigate("/login");
  },[])
}