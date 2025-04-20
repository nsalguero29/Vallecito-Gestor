import BaseModal from "../comun/modal/BaseModal";
import { 
    Button,
    TextField
  } from '@mui/material';
import { useDatosProveedor } from '../../hooks/useDatosProveedor';
import { useEffect } from "react";

export default function ModalProveedor ({guardarProveedor, salir, titulo,
  disabled, datos, editar}){

    const [datosProveedor, setDatoProveedor] = useDatosProveedor(null);

    useEffect(()=>{
      if(editar){
        setDatoProveedor('id', datos.id);
        setDatoProveedor('proveedor', datos.proveedor);
        setDatoProveedor('nombreContacto', datos.nombreContacto);
        setDatoProveedor('direccion', datos.direccion);
        setDatoProveedor('telefono', datos.telefono);
        setDatoProveedor('sitioWeb', datos.sitioWeb);
        setDatoProveedor('email', datos.email);
        setDatoProveedor('instagram', datos.instagram);
      }
    }, [])

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
          <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Proveedor"
              variant="outlined"
              value={datosProveedor.proveedor}
              onChange={(e) => setDatoProveedor('proveedor', e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Contacto"
              variant="outlined"
              value={datosProveedor.nombreContacto}
              disabled={disabled}
              onChange={(e) => setDatoProveedor('nombreContacto', e.target.value)}
            />
          </div>
          <div className="Row" >      
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Direccion"
              variant="outlined"
              value={datosProveedor.direccion}
              disabled={disabled}
              onChange={(e) => setDatoProveedor('direccion', e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Telefono"
              variant="outlined"
              value={datosProveedor.telefono}
              disabled={disabled}
              onChange={(e) => setDatoProveedor('telefono', e.target.value)}
            />
          </div>
          <div className="Row"> 
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="E-Mail"
              variant="outlined"
              value={datosProveedor.email}
              disabled={disabled}
              onChange={(e) => setDatoProveedor('email', e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Instagram"
              variant="outlined"
              value={datosProveedor.instagram}
              disabled={disabled}
              onChange={(e) => setDatoProveedor('instagram', e.target.value)}
            />
          </div>        
          <div className='Botonera'>
            <Button variant="contained" className='Boton' 
              disabled={disabled}
              onClick={() => { 
                guardarProveedor(datosProveedor, editar) 
              }}>
                Guardar Proveedor
            </Button>
          </div> 
        </div>
        </BaseModal>
    )
}