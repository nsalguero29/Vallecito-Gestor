import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import { getJWT } from '../comun/Funciones';
import { useLocation } from 'wouter';
import useEnv from '../../useEnv';

import {Accion, GenerarMessage, Paginador} from '../comun/Main';
import ModalMarca from './ModalMarca';
let controller = new AbortController();
let oldController;
let datos = [];
dayjs.locale('es');

export default function Index ({notificar}){
  const {ENV_LOADED, BASE_URL} = useEnv();
  const [location, navigate] = useLocation();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => { 
    if (!ENV_LOADED) return;
    init();  
  }, [ENV_LOADED])

  const [marcas, setMarcas] = useState([]);
  const [modalNuevaMarca, setModalNuevaMarca] = useState(false);
  const [modalEditarMarca, setModalEditarMarca] = useState(false);

  const [expandir, setExpandir] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    cargarMarcas();
  }

  const cargarMarcas = (busquedaNew = null, pageNew = null, limitNew = null)=>{
    const url = BASE_URL + "marcas/buscar";
    
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
          setMarcas(resp.data.marcas);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
          setDisabled(false);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarMarca= (marca, editar = false, id = null) => {
    setDisabled(false);
    let message = GenerarMessage(("¿Esta seguro que desea "+ (editar?"editar":"guardar") +" esta marca?"), ()=>saveMarca(marca, editar, id), ()=>{setDisabled(false)}, "Guardar");
    notificar({
      msg: message, 
      type: "info", 
      autoClose: false,  
      closeOnClick: false
    });    
  }

  const saveMarca = (marca, editar, id) =>{
    const url = BASE_URL + 'marcas/'
    getJWT()
    .then(({jwt})=>{
      if(!editar){
        const config = {headers:{authorization:jwt}};
        axios.post(url, {marca}, config)
        .then((res) => {
          if (res.data.status === "ok"){
            notificar({ 
              msg: "Marca Guardada.",
              type: "success",
              callback: () => {
                cargarMarcas();
                setModalNuevaMarca(false);
                setModalEditarMarca(false);
              }
            });
          } else {
            notificar({ msg: error, type: "error", callback: () => setDisabled(false) });   
          }
        })
      }else{
        const config = {
          headers:{
            authorization:jwt
          }
        };
        axios.put(url, {id, marca}, config)
        .then((res) => {
          if (res.data.status === "ok"){
            notificar({ 
              msg: "Marca Editada.",
              type: "success",
              callback: () => {
                cargarMarcas();
                setModalNuevaMarca(false);
                setModalEditarMarca(false);
              }
            });
          } else {
            notificar({ msg: error, type: "error", callback: () => setDisabled(false) });   
          }
        })
      }
    })
    .catch((error) => {
      notificar({ msg: error, type: "error", callback: () => setDisabled(false) });   
    })
  }

  const editar = (marca) =>{
    datos = marca;
    setModalEditarMarca(true);
  }

  return(
    <>
      {ENV_LOADED?
        <>
          <div className='' style={{display:'flex', flexDirection:'row'}}>
            {modalNuevaMarca && 
              <ModalMarca
                titulo="Nueva Marca"
                guardarMarca={(marca)=>guardarMarca(marca)}
                salir={() => setModalNuevaMarca(false)}
                disabled={disabled} 
              />
            }
            {modalEditarMarca && 
              <ModalMarca
                titulo="Nueva Marca"
                guardarMarca={(marca, editar, id)=>guardarMarca(marca, editar, id)}
                salir={() => setModalNuevaMarca(false)}
                datos={datos}
                editar={true}
                disabled={disabled} 
              />
            }
            <div style={{display:'flex', flex:1, flexDirection:'column'}}>
              <div style={{display:'flex', flex:1, placeContent:'center'}}>
                  <h2>LISTADO DE MARCAS</h2>          
              </div>
              <div className="Row">
                <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
                  Marca: 
                  <TextField
                    style={{ margin:10, width:350}}
                    className='Dato'
                    label="Buscar Marca"
                    variant="outlined"
                    value={busqueda}
                    onChange={(e) => {setBusqueda(e.target.value); cargarMarcas(e.target.value);}}
                  />
                </div>
                <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
                  <Button variant="contained" className='Boton' onClick={() => { setModalNuevaMarca(true) }}>Nueva Marca</Button>
                </div>   
                <div style={{display:'flex', flex:1}}>
                </div>        
              </div>       
              <div className='Listado' style={{display:'flex', flex:1, width:'99%'}}>
                {marcas.length !== 0 ?
                  marcas.map((marca, index)=>{
                    const productos = marca.productos;
                    return (
                      <div key={marca.id} className="Listado">
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
                            <div className="Row" style={{flex:2, placeContent:'space-between'}}>
                              <div style={{flex:1}}>
                                <strong> Marca: </strong> {marca.marca} 
                              </div>
                              <div style={{flex:1}}>
                                <strong>Productos ({productos?.length}) </strong>
                              </div>
                            </div>
                          </div>  
                          <div className="Acciones">   
                            <Accion
                              icono="edit"
                              ayuda="Editar"
                              backgroundColor="#00a5e5"
                              disabled={disabled}
                              onClick={() => editar(marca)}
                            />                     
                          </div>
                        </div>                
                        {expandir === index &&
                          <div className="Preguntas">
                            <div key={index} className="Row" style={{placeItems:'center'}}>
                              <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                                {productos.map((producto, index2) => {
                                  return(
                                    <div key={producto.id}>
                                      {producto.producto}<strong>{" (" + producto.stock + ")"}</strong>                                    
                                    </div>
                                  )
                                })}
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
                cargar={(busqueda, newPage, newLimit)=>cargarMarcas(busqueda, newPage, newLimit)}
                opciones={[5,15,25,50]}
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