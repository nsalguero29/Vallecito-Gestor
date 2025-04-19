import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField, Autocomplete
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Header, Paginador} from '../comun/Main';
import ModalProveedor from "./ModalProveedor";
import { getJWT } from '../comun/Funciones';
import { useLocation } from 'wouter';
import useEnv from '../../useEnv';

let controller = new AbortController();
let oldController;
dayjs.locale('es');

export default function Index ({notificar}){
  const {ENV_LOADED, BASE_URL} = useEnv();
  const [location, navigate] = useLocation();

  useEffect(() => { 
    if (!ENV_LOADED) return;
    init();
  }, [ENV_LOADED])

  const [proveedores, setProveedores] = useState([]);
  const [modalNuevoProveedor, setModalNuevoProveedor] = useState(false);

  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    cargarProveedores();
  }

  const cargarProveedores = (busquedaNew = null, pageNew = null, limitNew = null) => {
    const url = BASE_URL + "proveedores/buscar";
    
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
    const offset = (pag-1)* limit;
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
          setProveedores(resp.data.proveedores);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarProveedor = (datosProveedor, editar = false) => {
    if (window.confirm("¿Esta seguro que desea registrar un proveedor?")){
      const url = BASE_URL + 'proveedores/'
      getJWT()
      .then(({jwt})=>{        
        const config = {headers:{authorization:jwt}};
        axios.post(url, datosProveedor, config)
        .then((res) => {
          if (res.data.status === "ok"){
            alert("Guardado");
            cargarProveedores();
          } else {
            alert("Error")
          }
        })
      })
      .catch((error) => {
        alert("Error")
      })
    }
  }

  return(
    <>
      {ENV_LOADED?
        <>
          <div className='' style={{display:'flex', flexDirection:'row'}}>
            {modalNuevoProveedor && 
              <ModalProveedor
                titulo="Nuevo Proveedor"
                guardarProveedor={(datosProveedor)=>guardarProveedor(datosProveedor)}
                salir={() => setModalNuevoProveedor(false)}
              />
            }
            
            <div style={{display:'flex', flex:1, flexDirection:'column'}}>
              <div style={{display:'flex', flex:1, placeContent:'center'}}>
                  <h2>LISTADO DE PROVEEDORES</h2>          
              </div>
              <div className="Row">
                <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
                  Proveedor: 
                  <TextField
                    style={{ margin:10, width:350}}
                    className='Dato'
                    label="Buscar Proveedor"
                    variant="outlined"
                    value={busqueda}
                    onChange={(e) => {setBusqueda(e.target.value); cargarProveedores(e.target.value);}}
                  />
                </div>
                <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
                  <Button variant="contained" className='Boton' onClick={() => { setModalNuevoProveedor(true) }}>Nuevo Proveedor</Button>
                </div>   
                <div style={{display:'flex', flex:1}}>
                </div>        
              </div>
              <div className='Listado' style={{display:'flex', flex:1,  width:'99%'}}>
                {proveedores.length !== 0 ?
                  proveedores.map((proveedor, index)=>{
                  const productos = proveedor.productos;
                  return (
                    <div key={proveedor.id} className="Listado">
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
                          {/* <div style={{flex:1, margin:'0px 4px', 
                            display:'flex', justifyContent:'center'}}>
                            (ID {item.id})
                          </div> */}
                          <div style={{display:'flex', flex:2, 
                          flexDirection:'row', width:'100%'}}>
                            <div className="Row" style={{flex:2, placeContent:'space-between'}}>
                              <div style={{flex:1}}>
                                <strong> Proveedor: </strong> {proveedor.proveedor} 
                              </div>
                              <div style={{flex:1}}>
                                <strong> Telefono: </strong>  {proveedor.telefono} 
                              </div>
                              <div style={{flex:1}}>
                                <strong> Productos {" (" + productos.length + ")"}</strong>    
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="Acciones">
                          
                        </div>
                      </div>
                      {expandir === index &&
                        <div className="Preguntas">
                          <div style={{display:'flex', flexDirection:'row'}}>
                            <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                              <span>
                                <strong>Proveedor: </strong> {proveedor.proveedor}
                              </span>
                              <span>
                                <strong>Contacto: </strong> {proveedor.nombreContacto}
                              </span>
                              <span>
                                <strong>Direccion: </strong> {proveedor.direccion}
                              </span>
                            </div>
                            <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                              <span>
                                <strong>Email: </strong> {proveedor.email}
                              </span>
                              <span>
                                <strong>Instagram: </strong> {proveedor.instagram}
                              </span>
                            </div>
                          </div>
                          {productos.length !== 0 &&
                            <div key={"productos"}>
                              <div style={{display: 'flex', flex:1, margin:'5px 4px', maxWidth:30, flexDirection:'row', placeItems:'center'}}>
                                <Accion
                                  icono={expandir2 === index ? 'keyboard_arrow_up': 'keyboard_arrow_down'}
                                  ayuda="Expandir"
                                  backgroundColor={"lightgrey"}
                                  disabled={false}
                                  onClick={() =>{expandir2 === index ? setExpandir2() : setExpandir2(index)}}
                                />
                                <strong style={{flex:1}}>PRODUCTOS: </strong>
                              </div>
                              {expandir2 === index &&
                                <div>                          
                                  {productos.map((producto, index2) => {
                                    return(
                                      <>
                                        <ul key={producto.id} style={{paddingLeft:25, marginRight: 205}}>
                                          <div className="Row" style={{placeItems:'center'}}>                                
                                            <div style={{flex:1}}>
                                              <li>{producto.producto}<strong>{" (" + producto.stock + ")"}</strong> </li>
                                            </div>
                                          </div>                                
                                        </ul>
                                      </>
                                    )
                                  })}
                                </div>
                              }
                            </div>
                          }
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
                cargar={(busqueda, newPage, newLimit)=>cargarProveedores(busqueda, newPage, newLimit)}
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