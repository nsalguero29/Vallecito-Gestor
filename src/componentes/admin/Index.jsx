import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import Header from "../comun/Header";
import useEnv from '../../useEnv';

function Tarjeta ({titulo, url, icono}){
  return(
    <Link to={url} className="Tarjeta">
      <span className="material-icons Icono">{icono}</span>
      
      {titulo}
    </Link>
  )
}

export default function Index ({}){
  const {ENV_LOADED, BASE_URL} = useEnv();

  const [widthScreen, setWidthScreen] = useState(0);

  useEffect(() => { 
    if (!ENV_LOADED) return;
    init();  
  }, [ENV_LOADED])

  return(
    <>
      {ENV_LOADED?
        <>
          <div className='Container Index' style={{ alignContent: widthScreen > 550? "center" :"flex-start"}}>
              ADMIN
          </div>
        </>  
        :
        <center><strong>CARGANDO...</strong></center>
        }
    </>  
  )
}