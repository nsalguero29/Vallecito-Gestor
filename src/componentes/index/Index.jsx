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
        <Tarjeta url="/clientes" titulo="Clientes" icono=""/>
        {/*<Tarjeta url="/bicicletas" titulo="Bicicletas" icono=""/>
        <Tarjeta url="/arreglos" titulo="Arreglos" icono=""/>*/}
        <Tarjeta url="/ventas" titulo="Ventas" icono=""/>
        <Tarjeta url="/productos" titulo="Productos" icono=""/>
        <Tarjeta url="/proveedores" titulo="Proveedores" icono=""/>
        <Tarjeta url="/marcas" titulo="Marcas" icono=""/>
        {/* <Tarjeta url="/escanear" titulo="Escanear documento" icono="qr_code_scanner"/> */}
    </div>
  )
}