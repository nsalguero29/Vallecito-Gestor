import BaseModal from "../comun/modal/BaseModal";
import { 
    Button,
    TextField,
    Autocomplete
  } from '@mui/material';
import { useDatosVenta } from "../../hooks/useDatosVenta";
import { useEffect } from "react";

import React from 'react';


export default function ModalVenta ({guardarVenta, tiposProductoLista,
   clientesLista, salir, titulo, datos, editar}){

    const [datosVenta, setDatoVenta] = useDatosVenta(null);

    useEffect(()=>{
      if(editar){
        setDatoVenta('id', datos.id);
        setDatoVenta('numFactura', datos.numFactura);
        setDatoVenta('fechaVenta', datos.fechaVenta);
        setDatoVenta('tipoPago', datos.tipoPago);
        setDatoVenta('observacion', datos.observacion);
        setDatoVenta('valorFinal', datos.valorFinal);
        setDatoVenta('facturada', datos.facturada);
        setDatoVenta('productos', datos.productos);
      }
    }, [])
    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="numFactura"
              variant="outlined"
              value={datosVenta.numFactura}
              onChange={(e) => setDatoVenta('numFactura', e.target.value)}
            />
            <TextField
              style={{ flex: 3, margin: 10 }}
              className="Dato"
              label="fechaVenta"
              variant="outlined"
              value={datosVenta.fechaVenta}
              onChange={(e) => setDatoVenta("fechaVenta", e.target.value)}
            />
            
          </div>
          <div className="Row">
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="tipoPago"
              variant="outlined"
              value={datosVenta.tipoPago}
              onChange={(e) => setDatoVenta('tipoPago', e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="valorFinal"
              variant="outlined"
              value={datosVenta.valorFinal}
              onChange={(e) => setDatoVenta('valorFinal', e.target.value)}
            />
          </div>          
          <div className="Row"> 
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Observacion"
              variant="outlined"
              value={datosVenta.observacion}
              onChange={(e) => setDatoVenta('observacion', e.target.value)}
            />
          </div>        
          <div className='Botonera'>
            <Button variant="contained" className='Boton' onClick={() => { salir(); guardarVenta(datosVenta, editar) }}>Guardar Nueva Venta</Button>
          </div> 
        </div>
        </BaseModal>
    )
}