import BaseModal from "../comun/modal/BaseModal";
import { 
    Button,
    TextField,
    Autocomplete,
    InputLabel,
    Select,
    MenuItem, FormControl
  } from '@mui/material';
import { useDatosVenta } from "../../hooks/useDatosVenta";
import { useEffect, useState} from "react";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios from 'axios';
let controller = new AbortController();
let oldController;
let datos = [];
dayjs.locale('es');

import React from 'react';

function DetalleVenta ({productosLista, detalle, index, setDatoDetalle, eliminarDetalle, cargando}){

  return(
    <div style={{display:'flex', flexDirection:'row', margin:'10px 50px'}}>
      <Autocomplete
        value={detalle.producto?.producto}
        onChange={(e,n) => {setDatoDetalle(index, "producto", n)}}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={productosLista}
        getOptionLabel={(option) => option.producto}
        noOptionsText="Sin resultados"
        size="small"
        style={{flex: 3, width:'98.5%', margin: '4px 4px'}}
        renderInput={(params) => <TextField {...params} label="Producto"/>}
        disabled={cargando}
      />
      <TextField
        style={{ flex: 1, margin: 10 }}
        className='Dato'
        label="Cantidad"
        variant="outlined"
        value={detalle.cantidad}
        onChange={(e) => setDatoDetalle(index, "cantidad", e.target.value) }
        disabled={cargando}
      />
      <TextField
        style={{ flex: 1, margin: 10 }}
        className='Dato'
        label="Precio Unitario"
        variant="outlined"
        value={detalle.precio}
        onChange={(e) => setDatoDetalle(index, "precio", e.target.value)}
        disabled={cargando}
      />
      <Button
        variant="contained" className='Boton'
        onClick={() => eliminarDetalle(index)}
        disabled={cargando}
      >-</Button>
    </div>
  )
}

export default function NuevaVenta ({BASE_URL}){

  const [datosVenta, setDatoVenta] = useDatosVenta();

  const [detallesVenta, setDetallesVenta] = useState([{producto:{}, cantidad:1, precio:0}]);

  const [productosLista, setProductosLista] = useState([]);
  const [clientesLista, setClientesLista] = useState([]);

  const [cargando, setCargando] = useState(true);    

  const cargarProductos = () => {
    return new Promise((resolve, reject) => {       
    
      const url = BASE_URL + "productos/listar";
      oldController = controller;
      oldController.abort();
      oldController = null;
      controller = new AbortController();

      const config = {
        headers:{authorization: sessionStorage.getItem('token')},
        signal: controller.signal      
      }
      axios.get(url, config)
      .then((resp)=>{   
        if(resp.data.status === "ok"){       
          setProductosLista(resp.data.productos);  
          resolve();  
        }
      })
      .catch((error)=>{
        if(!axios.isCancel) {alert(error); reject()};
      })
    })
  }
  
  const cargarClientes = () => {
    return new Promise((resolve, reject) => {       

      const url = BASE_URL + "clientes/listar";
      
      oldController = controller;
      oldController.abort();
      oldController = null;
      controller = new AbortController();

      const config = {
        headers:{authorization: sessionStorage.getItem('token')},
        signal: controller.signal
      }
      axios.get(url, config)
      .then((resp)=>{
        if(resp.data.status === "ok"){        
          setClientesLista(resp.data.clientes);  
          resolve();     
        }
      })
      .catch((error)=>{
        if(!axios.isCancel) {alert(error); reject()};
      })
    })
  }

  const setDatoDetalle = (index, campo, valor) =>{
    let newDetallesVenta = JSON.parse(JSON.stringify(detallesVenta));
    switch (campo) {
      case "producto":
        newDetallesVenta[index].producto = valor;
        break;
      case "cantidad":
        newDetallesVenta[index].cantidad = valor;
        break;
      case "precio":
        newDetallesVenta[index].precio = valor;
        break;
      default:
        break;
    }
    setDetallesVenta(newDetallesVenta);
  }

  const agregarDetalle = () => {
    let newDetallesVenta = JSON.parse(JSON.stringify(detallesVenta));
    newDetallesVenta.push({producto:{}, cantidad:1, precio:0});
    setDetallesVenta(newDetallesVenta);
  }

  const eliminarDetalle = (index) =>{
    let newDetallesVenta = JSON.parse(JSON.stringify(detallesVenta));
    newDetallesVenta.splice(index,1)
    setDetallesVenta(newDetallesVenta);
  }

  useEffect(()=>{
    cargarProductos()
    .then(()=>{
      cargarClientes()
      .then(()=>{
        setCargando(false)
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }, [])

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
        <div className="Row">
          <h2>NUEVA VENTA</h2>
        </div>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Num. Factura"
            variant="outlined"
            value={datosVenta.numFactura}
            onChange={(e) => setDatoVenta('numFactura', e.target.value)}
            disabled={cargando}
          />
          <div style={{flex:'flex', placeItems:'center', placeContent:'center'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker               
                label="Fecha de Venta" 
                value={dayjs(datosVenta.fechaVenta)}
                views={['day', 'month', 'year']}
                disableFuture={true}
                format="DD/MM/YYYY"
                onChange={(e) => setDatoVenta("fechaVenta", e)}
                disabled={cargando}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="Row">
          <Autocomplete
            value={datosVenta.cliente}
            onChange={(e,n) => {setDatoVenta("cliente", n)}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={clientesLista}
            getOptionLabel={(option) => option.documento + " - " + option.apellidos + ", " + option.nombres}
            noOptionsText="Sin resultados"
            size="small"
            style={{flex: 3, width:'98.5%', margin: '4px 4px'}}
            renderInput={(params) => <TextField {...params} label="Cliente"/>}
            disabled={cargando}
          />
        </div>
        <div className="Row">
          <FormControl sx={{ m: 1, minWidth: 150 }}> 
            <InputLabel id="TipoPagoLabel">Tipo de Pago</InputLabel>
            <Select
              labelId="TipoPagoLabel"
              label="Tipo de Pago"
              value={datosVenta.tipoPago}
              onChange={(e)=>setDatoVenta('tipoPago', e.target.value)}
              disabled={cargando}
            >
              <MenuItem value={"Efectivo"}>Efectivo</MenuItem>
              <MenuItem value={"Debito"}>Debito</MenuItem>
              <MenuItem value={"Credito"}>Credito</MenuItem>
              <MenuItem value={"Transferencia"}>Transferencia</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Valor Final"
            variant="outlined"
            value={datosVenta.valorFinal}
            onChange={(e) => setDatoVenta('valorFinal', e.target.value)}
            disabled={cargando}
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
            disabled={cargando}
          />
        </div>        
        <div className="Row" style={{display:"flex", flexDirection:"column"}}>
            
          <hr width="90%"/>
          <div className="Row"> 

          <h3>Detalles de Venta</h3>
          </div>

          <div className="Row"> 
            <Button
              variant="contained" className='Boton'
              onClick={() => agregarDetalle()}
            >Agregar detalle</Button>
          </div>

          <div className="Column">
            {detallesVenta.map((detalle, index) => {           
              return(              
                <DetalleVenta
                  key={index}
                  index={index}
                  productosLista={productosLista}
                  detallesVenta={detallesVenta}
                  detalle={detalle}
                  setDatoDetalle={(index, campo, valor)=>setDatoDetalle(index, campo, valor)}
                  eliminarDetalle={(index)=>eliminarDetalle(index)}
                  disabled={cargando}
                />
              )
            })}
          </div>
        </div>
        <div className='Botonera'>
          <Button variant="contained" className='Boton' 
            onClick={() => { salir(); guardarVenta(datosVenta, editar) 
            disabled={cargando}
          }}>Guardar Nueva Venta</Button>
        </div> 
    </div>
  )
}