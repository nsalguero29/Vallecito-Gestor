import { Link, useLocation } from "react-router-dom";
import './styles.css';

//import gobLogo from '../../assets/images/LogoIco.png';
import Logo from '../../assets/images/Logo.jpg';

const MENU = [
  {ruta:"/clientes", titulo:"CLIENTES"},
  {ruta:"/bicicletas", titulo:"BICICLETAS"},
  {ruta:"/arreglos", titulo:"ARREGLOS"},
  {ruta:"/productos", titulo:"PRODUCTOS"},
  {ruta:"/proveedores", titulo:"PROVEEDORES"},
  {ruta:"/marcas", titulo:"MARCAS"}
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

export default function Header({logged}){
  const location = useLocation();
  const derecha = () => {
    if(logged) {
      return(
        <>
        <Opcion
          ruta="/admin"
          seleccionada={false}
          >Admin</Opcion>
        <Opcion
          ruta="/logout"
          seleccionada={false}
          >Cerrar Sesión</Opcion>
        </>
      )
    } else {
      return (
        <Opcion
          ruta="/login"
          seleccionada={false}
        >Iniciar Sesión</Opcion>
      )
    }
  }

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

        {logged && MENU.map((link, index) => 
          <Opcion
            key={index}
            ruta={link.ruta}
            seleccionada={location.pathname === link.ruta}
          >{link.titulo}</Opcion>
        )}
      </div>
      <div style={{margin: 'auto 0'}}>
        {derecha()}
      </div>
    </div>
  )
}