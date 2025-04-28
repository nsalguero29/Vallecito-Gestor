import { Link } from "wouter"
function Tarjeta ({titulo, url, icono}){
  return(
    <Link href={url} className="Tarjeta">
      <span className="material-icons Icono">{icono}</span>
      {titulo}
    </Link>
  )
}


export default function Index ({}){
  return(
    <>
      <div className='Container Index' >
          <Tarjeta url="/clientes" titulo="Clientes" icono=""/>
          {/*<Tarjeta url="/bicicletas" titulo="Bicicletas" icono=""/>
          <Tarjeta url="/arreglos" titulo="Arreglos" icono=""/>*/}
          {/* <Tarjeta url="/ventas" titulo="Ventas" icono=""/> */}
          <Tarjeta url="/productos" titulo="Productos" icono=""/>
          <Tarjeta url="/proveedores" titulo="Proveedores" icono=""/>
          <Tarjeta url="/marcas" titulo="Marcas" icono=""/>
          {/* <Tarjeta url="/escanear" titulo="Escanear documento" icono="qr_code_scanner"/> */}
      </div>
    </>
  )
}