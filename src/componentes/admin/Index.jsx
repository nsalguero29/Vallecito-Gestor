import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';

function Tarjeta ({titulo, url, icono}){
  return(
    <Link to={url} className="Tarjeta">
      <span className="material-icons Icono">{icono}</span>
      
      {titulo}
    </Link>
  )
}

export default function Index ({}){

  const [widthScreen, setWidthScreen] = useState(0);

  useEffect(() => setWidthScreen(window.screen.width),[])

  return(
    <div className='Container Index' style={{ alignContent: widthScreen > 550? "center" :"flex-start"}}>
        ADMIN
    </div>
  )
}