import BaseModal from "../comun/modal/BaseModal";
import { 
    Button,
    TextField,
    Autocomplete
  } from '@mui/material';
import { useDatosProducto } from '../../hooks/useDatosProducto';
import { useEffect } from "react";

import React from 'react';


export default function ModalNuevoProducto ({guardarProducto, proveedoresLista, tiposProductoLista,
  marcasLista, salir, titulo, datos, editar}){

    const [datosProducto, setDatoProducto] = useDatosProducto(null);

    useEffect(()=>{
      if(editar){
        setDatoProducto('id', datos.id);
        setDatoProducto('proveedor', datos.proveedor);
        setDatoProducto('codigoProveedor', datos.codigoProveedor);
        setDatoProducto('producto', datos.producto);
        setDatoProducto('tiposProducto', datos.tiposProducto);
        setDatoProducto('marca', datos.marca);
        setDatoProducto('stock', datos.stock);
        setDatoProducto('precioLista', datos.precioLista);
        setDatoProducto('observacion', datos.observacion);
      }
    }, [])
    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
          <div className="Row">
            <Autocomplete
              value={datosProducto.proveedor}
              onChange={(e,n) => {setDatoProducto('proveedor', n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={proveedoresLista}
              getOptionLabel={(option) => option.proveedor}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Proveedor"/>}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Codigo Proveedor"
              variant="outlined"
              value={datosProducto.codigoProveedor}
              onChange={(e) => setDatoProducto('codigoProveedor', e.target.value)}
            />
          </div>
          <div className="Row">
            <TextField
              style={{ flex: 3, margin: 10 }}
              className="Dato"
              label="Producto"
              variant="outlined"
              value={datosProducto.producto}
              onChange={(e) => setDatoProducto("producto", e.target.value)}
            />
            <Autocomplete
              value={datosProducto.tiposProducto}
              onChange={(e,n) => {setDatoProducto('tiposProducto', n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={tiposProductoLista}
              getOptionLabel={(option) => option.tipoProducto}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 2, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Tipo Producto"/>}
              multiple={true}
            />
          </div>
          <div className="Row" >  
            <Autocomplete
              value={datosProducto.marca}
              onChange={(e,n) => {setDatoProducto('marca', n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={marcasLista}
              getOptionLabel={(option) => option.marca}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Marca"/>}
            />    
            <TextField
              style={{ flex: 2, margin: 10 }}
              className='Dato'
              label="Stock"
              variant="outlined"
              value={datosProducto.stock}
              type="number"
              onChange={(e) => setDatoProducto('stock', e.target.valueAsNumber)}
            />
            <TextField
              style={{ flex: 2, margin: 10 }}
              className='Dato'
              label="Precio Lista"
              variant="outlined"
              value={datosProducto.precioLista}
              type="number"
              inputProps={{
                step: "1"
              }}
              onChange={(e) => setDatoProducto('precioLista', e.target.valueAsNumber)}
            />
          </div>
          <div className="Row"> 
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Observacion"
              variant="outlined"
              value={datosProducto.observacion}
              onChange={(e) => setDatoProducto('observacion', e.target.value)}
            />
          </div>        
          <div className='Botonera'>
            <Button variant="contained" className='Boton' onClick={() => { salir(); guardarProducto(datosProducto, editar) }}>Guardar Nuevo Producto</Button>
          </div> 
        </div>
        </BaseModal>
    )
}