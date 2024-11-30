import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Header, Paginador} from '../comun/Main';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getJWT } from '../comun/Funciones';

let controller = new AbortController();
let oldController;
let datos = [];
dayjs.locale('es');

export default function Index ({BASE_URL, checkLogged}){
  const navigate = useNavigate();  
  useEffect(()=>{
    checkLogged()
    .then(()=>{
      init();
    })
    .catch((error)=>{
      navigate('/login');
    })
  },[])
  
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
    cargarVentas();
  }

  const cargarTiposProductos = () => {
    const url = BASE_URL + "tiposProductos/listar";
    getJWT()
    .then((jwt)=>{      
      const config = {
        headers:{authorization: jwt}      
      }
      axios.get(url, config)
      .then((resp)=>{   
        if(resp.data.status === "ok"){
          setTiposProducto(resp.data.tiposProducto);
        }
      })
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
    getJWT()
    .then((jwt)=>{      
      const config = {
        headers:{authorization: jwt},
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
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }  

  const guardarVenta = (datosVenta, editar = false) => {
    if (window.confirm("¿Esta seguro que desea guardar la venta?")){
      const url = BASE_URL + 'ventas/'
      
      //datosProducto.marcaId = datosProducto.marca.id;
      //datosProducto.proveedorId = datosProducto.proveedor.id;
      let productos = [];
      datosVenta.productos.forEach(element => {
        productos.push(element.id);
      });
      datosVenta.ProductosIds = productos;
      const popup = toast.loading("Guardando Venta.", {containerId:'popup', isLoading:true, autoClose:2500});
      getJWT()
      .then((jwt)=>{        
        axios({
          method: editar?'put':'post',
          headers:{authorization:jwt},
          data: datosVenta,
          url
        })
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok"){
            toast.update(popup, {render:"Venta guardado.", containerId:'popup', type:'success', isLoading:false, autoClose:2500, onClose:()=>cargarVentas()});
          } else {
            toast.update(popup, {render:"Error guardando venta.", containerId:'popup', type:'error', isLoading:false, autoClose:2500});
          }
        })
      })
      .catch((error) => {
        toast.update(popup, {render: error, containerId:'popup', type:'error', isLoading:false, autoClose:2500});
      })
    }
  }

  const editar = (venta) =>{
    datos = venta;
    setModalEditarVenta(true);
  }

  return(
    <>
      <Header isAdmin={false}/>
      <div className='' style={{display:'flex', flexDirection:'row'}}>
        {modalNuevaVenta &&        
          <ModalVenta
            titulo="Nueva Venta"
            BASE_URL={BASE_URL}
            guardarVenta={(datosVenta)=>guardarVenta(datosVenta)}
            salir={() => setModalNuevaVenta(false)}
            editar={false}
          />
        }
        
        <div style={{display:'flex', flex:1, flexDirection:'column'}}>
          <div style={{display:'flex', flex:1, placeContent:'center'}}>
              <h2>LISTADO DE VENTAS</h2>          
          </div>
          <div className="Row">
            <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
              Nro. Factura: 
              <TextField
                style={{ margin:10, width:350}}
                className='Dato'
                label="Buscar Venta"
                variant="outlined"
                value={busqueda}
                onChange={(e) => {setBusqueda(e.target.value); cargarVentas(e.target.value);}}
              />
            </div>
            <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
              <Button variant="contained" className='Boton' onClick={() => { navigate('/ventas/nueva') }}>Nueva Venta</Button>
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
                          <Accion
                            icono={expandir === index ? 'keyboard_arrow_up': 'keyboard_arrow_down'}
                            ayuda="Expandir"
                            backgroundColor={"lightgrey"}
                            disabled={false}
                            onClick={() =>{expandir === index ? setExpandir() : setExpandir(index)}}
                          />
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
                            <div style={{flex:1}}>
                              <strong> Facturada: </strong>  {venta.facturada?"Facturada":"Pendiente"} 
                            </div>
                            <div style={{flex:1, display:'flex'}}>
                              <strong> Cliente: {venta.cliente.documento} - {venta.cliente.apellidos}, {venta.cliente.nombres}  </strong>
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
                    {expandir === index &&
                      <div className="Preguntas">
                        <div style={{display:'flex', flexDirection:'row'}}>
                          <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                            <span>
                              <strong>Observacion: </strong> {venta.observacion}
                            </span>
                            <span>
                              <strong>Productos: </strong>
                            </span>
                            <span>
                              {venta.detalles.length !== 0 &&
                                <div>
                                  <div>                          
                                    {venta.detalles.map((detalle, index2) => {
                                      return(
                                        <>
                                          <ul key={detalle.id} style={{paddingLeft:25, marginRight: 205}}>
                                            <div className="Row" style={{placeItems:'center'}}>                                
                                              <div style={{flex:1}}>
                                                <li><strong>{" ("}{detalle.cantidad}{")"}</strong> {detalle.producto.producto} - ${detalle.precio} </li>
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
                    }                 
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
            cargar={(busqueda, newPage, newLimit)=>cargarVentas(busqueda, newPage, newLimit)}
            opciones={[5,10,15,25,50]}
          />
        </div>
      </div>
    </>
  )
}