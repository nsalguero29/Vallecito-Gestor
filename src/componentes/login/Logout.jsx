import { useEffect } from "react";
import { useLocation } from 'wouter';
import Cookies from 'js-cookie';
import useEnv from '../../useEnv';

export default function Logout({checkLogged}){
  const {ENV_LOADED, BASE_URL} = useEnv();
  const [location, navigate] = useLocation();

  useEffect(() => { 
    if (!ENV_LOADED) return;
    Cookies.remove("jwt");
    Cookies.remove("user");
    checkLogged();
    navigate("/login");
  }, [ENV_LOADED])
  
  return (
    <>
      <span>Saliendo...</span>
    </>
  )
}