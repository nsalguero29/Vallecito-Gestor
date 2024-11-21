import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Paginador} from '../comun/Main';
import ModalVenta from './ModalVenta';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let controller = new AbortController();
let oldController;
let datos = [];
dayjs.locale('es');

export default function Index ({BASE_URL}){
  
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [modalNuevaVenta, setModalNuevaVenta] = useState(false); 

  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = () => {
    cargarTiposProductos();
    cargarProductos();
    cargarVentas();
  }

  const cargarTiposProductos = () => {
    const url = BASE_URL + "tiposProductos/listar";
    const config = {
      headers:{authorization: sessionStorage.getItem('token')}      
    }
    axios.get(url, config)
    .then((resp)=>{   
      if(resp.data.status === "ok"){
        setTiposProducto(resp.data.tiposProducto);
      }
    })
    .catch((error)=>{
      if(!axios.isCancel) alert(error);
    })
  }

  const cargarProductos = () => {
    const url = BASE_URL + "productos/listar";
    const config = {
      headers:{authorization: sessionStorage.getItem('token')}      
    }
    axios.get(url, config)
    .then((resp)=>{   
      if(resp.data.status === "ok"){
        setProductos(resp.data.productos);
      }
    })
    .catch((error)=>{
      if(!axios.isCancel) alert(error);
    })
  }

  const cargarVentas = (busquedaNew = null, pageNew = null, limitNew = null) => {
    const url = BASE_URL + "ventas/buscar";
    
    oldController = controller;
    oldController.abort();
    oldController = null;
    controller = new AbortController();

    if(limitNew!==null){
      setLimit(limitNew);
    }
    if(pageNew!==null){
      setPage(pageNew);
    }

    const limite = limitNew!==null?limitNew:limit;
    const pag = pageNew!==null?pageNew:page;
    const bus = busquedaNew!==null? busquedaNew:busqueda;
    const offset = (pag-1)* limite;

    const config = {
      headers:{authorization: sessionStorage.getItem('token')},
      params:{
        limit: limite, 
        busqueda: bus,
        offset
      },
      signal: controller.signal
    }
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        setVentas(resp.data.ventas);
        const paginasTotales = Math.ceil(resp.data.total / limite);
        setPaginasTotales(paginasTotales);
      }
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }  

  const guardarProducto = (datosProducto, editar = false) => {
    if (window.confirm("¿Esta seguro que desea guardar el producto?")){
      const url = BASE_URL + 'productos/'
      
      datosProducto.marcaId = datosProducto.marca.id;
      datosProducto.proveedorId = datosProducto.proveedor.id;
      let tipos = [];
      datosProducto.tiposProducto.forEach(element => {
        tipos.push(element.id);
      });
      datosProducto.tiposProductoIds = tipos;
      const popup = toast.loading("Guardando Producto.", {containerId:'popup', isLoading:true, autoClose:2500});
      axios({
        method: editar?'put':'post',
        headers:{authorization:sessionStorage.getItem('token')},
        data: datosProducto,
        url
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok"){
          toast.update(popup, {render:"Producto guardado.", containerId:'popup', type:'success', isLoading:false, autoClose:2500, onClose:()=>cargarProductos()});
        } else {
          toast.update(popup, {render:"Error guardando producto.", containerId:'popup', type:'error', isLoading:false, autoClose:2500});
        }
      })
      .catch((error) => {
        toast.update(popup, {render: error, containerId:'popup', type:'error', isLoading:false, autoClose:2500});
      })
    }
  }

  const editar = (producto) =>{
    datos = producto;
    setModalEditarProducto(true);
  }

  useEffect(() => {
    init();
  },[]);

  return(
    <div className='' style={{display:'flex', flexDirection:'row'}}>
      {modalNuevaVenta && 
        <ModalVenta
          titulo="Nueva Venta"
          productosLista={productos}
          guardarVenta={(datosVenta)=>guardarVenta(datosVenta)}
          salir={() => setModalNuevaVenta(false)}
          editar={false}
        />
      }
      
      <div style={{display:'flex', flex:1, flexDirection:'column'}}>
        <div style={{display:'flex', flex:1, placeContent:'center'}}>
            <h2>LISTADO DE PRODUCTOS</h2>          
        </div>
        <div className="Row">
          <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
            Producto: 
            <TextField
              style={{ margin:10, width:350}}
              className='Dato'
              label="Buscar Producto"
              variant="outlined"
              value={busqueda}
              onChange={(e) => {setBusqueda(e.target.value); cargarProductos(e.target.value);}}
            />
          </div>
          <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
            <Button variant="contained" className='Boton' onClick={() => { setModalNuevoProducto(true) }}>Nuevo Producto</Button>
          </div>   
          <div style={{display:'flex', flex:1}}>
          </div>        
        </div>
        <div className='Listado' style={{display:'flex', flex:1, width:'99%'}}>
          {ventas.length !== 0 ?
            ventas.map((venta, index)=>{
              return (
                <div key={venta.id} className="Listado">
                  <div className="Detalles">
                    <div style={{display:'flex', flexDirection:'row', 
                    alignItems:'center', justifyContent:'center', width:'100%'}}>
                      <div style={{flex:1, margin:'0px 4px', maxWidth:30}}>
                        {/* <Accion
                          icono={expandir === index ? 'keyboard_arrow_up': 'keyboard_arrow_down'}
                          ayuda="Expandir"
                          backgroundColor={"lightgrey"}
                          disabled={false}
                          onClick={() =>{expandir === index ? setExpandir() : setExpandir(index)}}
                        /> */}
                      </div>
                      <div style={{display:'flex', flex:2, 
                      flexDirection:'row', width:'100%'}}>
                        <div className="Row" style={{flex:2, placeContent:'space-between', placeItems:'center'}}>
                        <div style={{flex:1}}>
                            <strong> Num. Factura: </strong> {venta.numFactura} 
                          </div>
                          <div style={{flex:1}}>
                            <strong> Tipo de Pago: </strong> {venta.tipoPago} 
                          </div>
                          <div style={{flex:1}}>
                            <strong> Valor Final: </strong>  {venta.valorFinal} 
                          </div>
                          <div style={{flex:1, display:'flex'}}>
                            <strong> Cliente: ${venta.cliente.apellidos}, ${venta.cliente.nombres}  </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="Acciones">
                      {/* <Accion
                        icono="edit"
                        ayuda="Editar"
                        backgroundColor="#00a5e5"
                        disabled={false}
                        onClick={() => editar(venta)}
                      /> */}
                    </div>
                  </div>
                  {/* {expandir === index &&
                    <div className="Preguntas">
                      <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                          <span>
                            <strong>producto: </strong> {producto.producto}
                          </span>
                          <span>
                            {tiposProducto.length !== 0 &&
                              <div>
                                <div>                          
                                  {tiposProducto.map((tipoProducto, index2) => {
                                    return(
                                      <>
                                        <ul key={tipoProducto.id} style={{paddingLeft:25, marginRight: 205}}>
                                          <div className="Row" style={{placeItems:'center'}}>                                
                                            <div style={{flex:1}}>
                                              <li>{tipoProducto.tipoProducto}<strong>{" ()"}</strong> </li>
                                            </div>
                                          </div>                                
                                        </ul>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            }
                          </span>                          
                        </div>
                      </div>
                    </div>
                  } */}                  
                </div>
              );
            })
            :
            <center><strong>Sin Resultados</strong></center>
          }
        </div>
        <Paginador
          page={page}
          limit={limit}
          paginasTotales={paginasTotales}
          cargar={(busqueda, newPage, newLimit)=>cargarProductos(busqueda, newPage, newLimit)}
          opciones={[5,10,15,25,50]}
        />
      </div>
    </div>
  )
}