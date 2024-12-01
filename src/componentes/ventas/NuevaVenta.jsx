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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../comun/Funciones';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { getJWT } from '../comun/Funciones';

import React from 'react';
import Header from '../comun/Header';

let controller = new AbortController();
let oldController;
dayjs.locale('es');

function DetalleVenta ({productosLista, detalle, index, setDatoDetalle, eliminarDetalle, cargando}){

  return(
    <div key={index} style={{display:'flex', flexDirection:'row', margin:'10px'}}>
      <Autocomplete
        value={detalle.producto}
        onChange={(e,n) => {setDatoDetalle(index, "producto", n)}}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={productosLista}
        getOptionLabel={(option) => option.codigo + " - " + option.producto}
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
        label={"Precio Unitario (Precio Lista $"+ detalle.precioLista + ")"}
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

export default function NuevaVenta ({BASE_URL, checkLogged}){
  const navigate = useNavigate(); 

  const [datosVenta, setDatoVenta] = useDatosVenta();

  const [detallesVenta, setDetallesVenta] = useState([]);

  const [productosLista, setProductosLista] = useState([]);
  const [clientesLista, setClientesLista] = useState([]);

  const [cargando, setCargando] = useState(true);    
  const [valorDetalles, setValorDetalles] = useState(0);

  useEffect(()=>{
    checkLogged()
    .then(()=>{
      cargarProductos()
      .then(()=>{
        cargarClientes()
        .then(()=>{
          setDatoVenta("fechaVenta", dayjs());
          setDatoVenta("cliente", null);
          setCargando(false)
        })
      })
    })
    .catch((error)=>{
      navigate('/login');
    })
  },[]);

  useEffect(()=>{
    let sumaDetalles = 0;
    detallesVenta.forEach(detalle => {
      sumaDetalles += (detalle.cantidad * detalle.precio);
    });
    setDatoVenta("valorFinal", sumaDetalles);
    setValorDetalles(sumaDetalles);
  },[detallesVenta]);

  const cargarProductos = () => {
    return new Promise((resolve, reject) => {       
    
      const url = BASE_URL + "productos/listar";
      oldController = controller;
      oldController.abort();
      oldController = null;
      controller = new AbortController();
      getJWT()
      .then((jwt)=>{        
        const config = {
          headers:{authorization: jwt},
          signal: controller.signal      
        }
        axios.get(url, config)
        .then((resp)=>{   
          if(resp.data.status === "ok"){       
            setProductosLista(resp.data.productos);  
            resolve();  
          }
        })
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
      getJWT()
      .then((jwt)=>{        
        const config = {
          headers:{authorization: jwt},
          signal: controller.signal
        }
        axios.get(url, config)
        .then((resp)=>{
          if(resp.data.status === "ok"){        
            setClientesLista(resp.data.clientes);  
            resolve();     
          }
        })
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
        console.log(valor);        
        newDetallesVenta[index].producto = valor;
        newDetallesVenta[index].precioLista = valor.precioLista;
        newDetallesVenta[index].precio = valor.precioLista;
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
    setDetallesVenta(JSON.parse(JSON.stringify(newDetallesVenta)));
  }

  const agregarDetalle = () => {
    let newDetallesVenta = JSON.parse(JSON.stringify(detallesVenta));
    newDetallesVenta.push({producto:null, cantidad:1, precio:0});
    setDetallesVenta(newDetallesVenta);
  }

  const eliminarDetalle = (index) =>{
    console.log(index);    
    let newDetallesVenta = JSON.parse(JSON.stringify(detallesVenta));
    setDetallesVenta([]);
    newDetallesVenta.splice(index,1);
    console.log(newDetallesVenta);    
    setDetallesVenta(JSON.parse(JSON.stringify(newDetallesVenta)));
  }

  const guardarVenta= (datosVenta) => {
    const popup = toast.info("Registrando Venta..", {containerId: 'popup'});
    if(datosVenta.numFactura === "" || datosVenta.cliente === null || datosVenta.valorFinal === "" || datosVenta.tipoPago === null){      
      toast.update(popup, {
        render: "Falta completar algun dato..",
        type: "error",
        autoClose: 1500,
        containerId: 'popup'
      });
    }else{
      if(datosVenta.detallesVenta.lenght > 0){
        datosVenta.detallesVenta.forEach(element => {
          if(element.producto === null || element.cantidad <= 0) {
            toast.update(popup, {
              render: "Falta completar algun detalle",
              type: "error",
              isLoading: true,
              autoClose: 1500,
              containerId: 'popup'
            });
            return
          }
        });
      }
      const saveData = () => {
        toast.update(popup, {
          render: "Registrando..",
          type: "info",
          isLoading: true,
          containerId: 'popup'
        });

        const url = BASE_URL + 'ventas/'
        getJWT()
        .then((jwt)=>{        
          const config = {headers:{authorization:jwt}};
          datosVenta.detallesVenta = detallesVenta;
          
          const datos = {
            numFactura: datosVenta.numFactura,
            fechaVenta: datosVenta.fechaVenta,
            cliente: datosVenta.cliente,
            tipoPago: datosVenta.tipoPago,
            valorFinal: datosVenta.valorFinal,
            observacion: datosVenta.observacion,
            detallesVenta: datosVenta.detallesVenta
          }

          axios.post(url, datos, config)
          .then((resp)=>{
            if(resp.data.status === "ok"){
              toast.update(popup, { 
                render: "Venta Registrada.", 
                type: "success",  
                autoClose: 1500,
                onClose: () => navigate("/ventas"), 
                containerId: 'popup'
              });
            }else{        
              toast.update(popup, { render: resp.data.error, type: "error", isLoading: false,  autoClose: 2500, onClose: () => setDisabled(false), containerId: 'popup' });
            }
          })
        })
        .catch((error)=>{  
          toast.update(popup, { render: error, type: "error", isLoading: false,  autoClose: 2500, onClose: () => setDisabled(false), containerId: 'popup' });   
        })
      }

      showToast("¿Esta seguro que desea registrar esta venta?", saveData, popup);
    }
  }

  return (
    <>
      <Header isAdmin={false}/>
      <div style={{display:'flex', flexDirection:'column', minWidth:"1280px", placeSelf:'center'}}>
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
            <Button
              variant="contained" className='Boton'
              onClick={() => navigate("/clientes")}
            >+</Button>
            <Autocomplete
              value={datosVenta.cliente}
              onChange={(e,n) => {setDatoVenta("cliente", n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={clientesLista}
              getOptionLabel={(option) => option.documento + " - " + option.apellidos + ", " + option.nombres}
              noOptionsText="Sin resultados"
              size="small"
              style={{flex: 3, width:'98.5%', margin: '10px'}}
              renderInput={(params) => <TextField {...params} label="Cliente"/>}
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
              multiline
            />
          </div> 
          <div className="Row" style={{display:"flex", flexDirection:"column"}}>
              
            <hr width="90%"/>
            <div className="Row"> 
              <Button
                variant="contained" className='Boton'
                onClick={() => agregarDetalle()}
              >+</Button>
              <h3>Detalles de Venta</h3>
            </div>

            <div className="Column">
              {detallesVenta.map((detalle, index) => {           
                return(              
                  <DetalleVenta
                    key={index}
                    index={index}
                    productosLista={productosLista}
                    detalle={detalle}
                    setDatoDetalle={(index, campo, valor)=>setDatoDetalle(index, campo, valor)}
                    eliminarDetalle={(index)=>eliminarDetalle(index)}
                    disabled={cargando}
                  />
                )
              })}
            </div>
            <hr width="90%"/>
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
                <MenuItem value={"efectivo"}>Efectivo</MenuItem>
                <MenuItem value={"debito"}>Debito</MenuItem>
                <MenuItem value={"credito"}>Credito</MenuItem>
                <MenuItem value={"transferencia"}>Transferencia</MenuItem>
                <MenuItem value={"cheque"}>Cheque</MenuItem>
              </Select>
            </FormControl>
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Valor Detalles"
              variant="outlined"
              value={valorDetalles}
              controlled={true}
              disabled={true}
            />
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
                 
          
          <div className='Botonera'>
            <Button variant="contained" className='Boton' 
              disabled={cargando}
              onClick={() => { 
                guardarVenta(datosVenta) 
              }}
            >Guardar Nueva Venta</Button>
          </div> 
      </div>
    </>

  )
}