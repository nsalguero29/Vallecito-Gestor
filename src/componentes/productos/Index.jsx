import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Paginador} from '../comun/Main';
import ModalProducto from './ModalProducto';
import { useLocation } from 'wouter';

import { showToast } from '../comun/Funciones';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getJWT } from '../comun/Funciones';
import useEnv from '../../useEnv';

let controller = new AbortController();
let oldController;
let datos = [];
dayjs.locale('es');

export default function Index ({notificar}){
  const {ENV_LOADED, BASE_URL} = useEnv();
  const [location, navigate] = useLocation(); 
  const [disabled, setDisabled] = useState(false);

  useEffect(() => { 
    if (!ENV_LOADED) return;
    init();  
  }, [ENV_LOADED])

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false);
  const [modalEditarProducto, setModalEditarProducto] = useState(false); 

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = () => {
    setProductos([]);
    cargarProveedores();
    cargarMarcas();
    cargarTiposProductos();
    cargarProductos();
  }

  const cargarProveedores = () => {
      const url = BASE_URL + "proveedores/listar";
      getJWT()
      .then(({jwt})=>{        
        const config = {
          headers:{authorization: jwt}      
        }
        axios.get(url, config)
        .then((resp)=>{
          if(resp.data.status === "ok"){
            setProveedores(resp.data.proveedores);
          }
        })
      })
      .catch((error)=>{
        if(!axios.isCancel) alert(error);})
  }

  const cargarMarcas = () => {
    const url = BASE_URL + "marcas/listar";
    getJWT()
    .then(({jwt})=>{      
      const config = {
        headers:{authorization: jwt}      
      }
      axios.get(url, config)
      .then((resp)=>{   
        if(resp.data.status === "ok"){
          setMarcas(resp.data.marcas);
        }
      })
    })
    .catch((error)=>{
      if(!axios.isCancel) alert(error);
    })
  }

  const cargarTiposProductos = () => {
    const url = BASE_URL + "tiposProductos/listar";
    getJWT()
    .then(({jwt})=>{      
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

  const cargarProductos = (busquedaNew = null, pageNew = null, limitNew = null) => {
    const url = BASE_URL + "productos/buscar";
    
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
    .then(({jwt})=>{      
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
          setProductos(resp.data.productos);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }  

  const guardarProducto = (datosProducto, editar = false) => {
    let popup = toast.info("Registrando Producto..", {containerId: 'popup'});
    const saveData = () => {
      const url = BASE_URL + 'productos/'
      
      datosProducto.marcaId = datosProducto.marca.id;
      datosProducto.proveedorId = datosProducto.proveedor.id;
      let tipos = [];
      datosProducto.tiposProducto.forEach(element => {
        tipos.push(element.id);
      });
      datosProducto.tiposProductoIds = tipos;
      toast.update(popup, {render: "Guardando Producto.", type:'default', containerId:'popup', isLoading:true, autoClose:2500});
      getJWT()
      .then(({jwt})=>{        
        axios({
          method: editar?'put':'post',
          headers:{authorization:jwt},
          data: datosProducto,
          url
        })
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok"){
            toast.update(popup, {render:"Producto guardado.", containerId:'popup', type:'success', isLoading:false, autoClose:2500, onClose:()=>init()});
          } else {
            toast.update(popup, {render:"Error guardando producto.", containerId:'popup', type:'error', isLoading:false, autoClose:2500});
          }
          setModalEditarProducto(false);
        })
      })
      .catch((error) => {
        toast.update(popup, {render: error, containerId:'popup', type:'error', isLoading:false, autoClose:2500});
      })
    }
    showToast("¿Esta seguro que desea registrar esta venta?", saveData, popup);
  }

  const editar = (producto) =>{
    datos = producto;
    setModalEditarProducto(true);
  }

  return(
    <>
      {ENV_LOADED?
        <>
          <div className='' style={{display:'flex', flexDirection:'row'}}>
            {modalNuevoProducto && 
              <ModalProducto
                titulo="Nuevo Producto"
                proveedoresLista={proveedores}
                marcasLista={marcas}
                tiposProductoLista={tiposProducto}
                guardarProducto={(datosProducto)=>guardarProducto(datosProducto)}
                salir={() => setModalNuevoProducto(false)}
                editar={false}
                disabled={disabled} 
                setDisabled={setDisabled}
              />
            }

            {modalEditarProducto && 
              <ModalProducto
                titulo="Editar Producto"
                proveedoresLista={proveedores}
                marcasLista={marcas}
                tiposProductoLista={tiposProducto}
                guardarProducto={(datosProducto, editar)=>guardarProducto(datosProducto, editar)}
                salir={() => setModalEditarProducto(false)}
                datos={datos}
                editar={true}
                disabled={disabled} 
                setDisabled={setDisabled}
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
                {productos.length !== 0 ?
                  productos.map((producto, index)=>{
                    const tiposProducto = producto.tiposProducto;
                    return (
                      <div key={producto.id} className="Listado">
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
                                  <strong> Codigo: </strong> {producto.codigo} 
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Codigo Proveedor: </strong> {producto.codigoProveedor} 
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Producto: </strong> {producto.producto} 
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Stock: </strong>  {producto.stock} 
                                </div>
                                <div style={{flex:1, display:'flex'}}>
                                  <strong> Precio Lista: ${producto.precioLista} </strong>
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Marca: </strong> {producto.marca.marca}
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Proveedor: </strong> {producto.proveedor.proveedor}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="Acciones">
                            <Accion
                              icono="edit"
                              ayuda="Editar"
                              backgroundColor="#00a5e5"
                              disabled={false}
                              onClick={() => editar(producto)}
                            />
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
        </>
        :
        <center><strong>CARGANDO...</strong></center>
        }
    </>
  )
}