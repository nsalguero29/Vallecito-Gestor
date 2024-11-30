import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getJWT } from '../comun/Funciones';

export default function Logout({logout}){

  const navigate = useNavigate();

  useEffect(() => {   
    getJWT()
    .then(() => {
      Cookies.remove("jwt");
      navigate("/");
    })
    .catch(() => navigate("/ingresar") );
  }, [])
}