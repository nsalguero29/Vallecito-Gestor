import BaseModal from "../comun/modal/BaseModal";
import { 
    Button,
    TextField
  } from '@mui/material';
import { useDatosProveedor } from '../../hooks/useDatosProveedor';

export default function ModalProveedor ({guardarProveedor, salir, titulo}){

    const [datosProveedor, setDatoProveedor] = useDatosProveedor(null);

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
          <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Proveedor"
              variant="outlined"
              value={datosProveedor.apellidos}
              onChange={(e) => setDatoProveedor('proveedor', e.target.value)}
            />
          </div>
          <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Contacto"
              variant="outlined"
              value={datosProveedor.apellidos}
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
              onChange={(e) => setDatoProveedor('direccion', e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Telefono"
              variant="outlined"
              value={datosProveedor.telefono}
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
              onChange={(e) => setDatoProveedor('email', e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Instagram"
              variant="outlined"
              value={datosProveedor.instagram}
              onChange={(e) => setDatoProveedor('instagram', e.target.value)}
            />
          </div>        
          <div className='Botonera'>
            <Button variant="contained" className='Boton' onClick={() => { salir(); guardarProveedor(datosProveedor) }}>Guardar Nuevo Proveedor</Button>
          </div> 
        </div>
        </BaseModal>
    )
}