import { Link, useLocation } from "react-router-dom";
import './styles.css';
import { useEffect, useState } from "react";

//import gobLogo from '../../assets/images/LogoIco.png';
import Logo from '../../assets/images/Logo.jpg';

const MENU = [
  {ruta:"/clientes", titulo:"CLIENTES"},
  //{ruta:"/bicicletas", titulo:"BICICLETAS"},
  //{ruta:"/arreglos", titulo:"ARREGLOS"},
  {ruta:"/ventas", titulo:"VENTAS"},
  {ruta:"/marcas", titulo:"MARCAS"},
  {ruta:"/proveedores", titulo:"PROVEEDORES"},
  {ruta:"/productos", titulo:"PRODUCTOS"},
  {ruta:"/tiposProductos", titulo:"CATEGORIAS"}
]

function Opcion ({ruta, seleccionada, children}){

  return(
    <Link 
      className={`Opcion ${seleccionada && 'Seleccionada'}`}
      to={ruta}
    >
      {children}
    </Link>
  )
}

export default function Header({isAdmin}){
  const location = useLocation();

  return(
    <div className="Header">
      <Link to="/" className="Titulo" style={{display:"flex", width:70, placeContent:'center'}}> 
        <img src={Logo} alt="Logo" style={{width:"100%"}}/> 
      </Link>
      <div className="Opciones">
        {MENU.map((link, index) => 
          <Opcion
            key={index}
            ruta={link.ruta}
            seleccionada={location.pathname === link.ruta}
          >{link.titulo}</Opcion>
        )}
      </div>
      <div style={{margin: 'auto 0'}}>
        <Opcion
          ruta="/logout"
          seleccionada={false}
        >Cerrar Sesión</Opcion>
      </div>
    </div>
  )
}