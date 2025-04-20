import BaseModal from '../comun/modal/BaseModal';
import { 
    Button,
    TextField
  } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ModalTipoProducto ({ 
  guardarTipo, salir, titulo, disabled, datos, editar}){

    const [id, setId] = useState(null);
    const [nombreTipoProducto, setNombreTipoProducto] = useState("");
    
    useEffect(()=>{
      if(editar){ 
        setId(datos.id);
        setNombreTipoProducto(datos.tipoProducto)
      }
    }, [])

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
          <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
            <div className="Linea">
              <TextField
                style={{ flex: 1, margin: 10 }}
                className='Dato'
                label="Marca"
                variant="outlined"
                disabled={disabled}
                value={nombreTipoProducto}
                onChange={(e) => setNombreTipoProducto(e.target.value)}
              />
            </div>
            <div className="Linea" style={{display:'flex', placeContent:'center'}}>
              <Button variant="contained" className='Boton' 
              disabled={disabled}
              onClick={() => { guardarTipo(nombreTipoProducto, editar, id); }}>Guardar</Button>
            </div>
          </div>
        </BaseModal>
    )
}