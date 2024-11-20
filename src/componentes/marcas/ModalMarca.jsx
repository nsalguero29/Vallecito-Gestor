import BaseModal from '../comun/modal/BaseModal';
import { 
    Button,
    TextField
  } from '@mui/material';

export default function ModalMarca ({ 
  guardarMarca, setNombreMarca, salir, nombreMarca, titulo}){
    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
          <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
            <div className="Linea">
              <TextField
                style={{ flex: 1, margin: 10 }}
                className='Dato'
                label="Marca"
                variant="outlined"
                value={nombreMarca}
                onChange={(e) => setNombreMarca(e.target.value)}
              />
            </div>
            <div className="Linea" style={{display:'flex', placeContent:'center'}}>
              <Button variant="contained" className='Boton' onClick={() => { salir(); guardarMarca(); }}>Guardar Nueva Marca</Button>
            </div>
          </div>
        </BaseModal>
    )
}