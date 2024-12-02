import BaseModal from '../comun/modal/BaseModal';
import { 
    Button,
    TextField
  } from '@mui/material';

export default function ModalTipoProducto ({ 
  guardarTipo, setTipo, salir, tipo, titulo}){
    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
          <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
            <div className="Linea">
              <TextField
                style={{ flex: 1, margin: 10 }}
                className='Dato'
                label="Marca"
                variant="outlined"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>
            <div className="Linea" style={{display:'flex', placeContent:'center'}}>
              <Button variant="contained" className='Boton' onClick={() => { salir(); guardarTipo(); }}>Guardar</Button>
            </div>
          </div>
        </BaseModal>
    )
}