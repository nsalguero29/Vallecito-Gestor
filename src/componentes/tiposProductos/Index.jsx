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
import ModalTipoProducto from './ModalTipoProducto';

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

  const [tiposProducto, setTiposProducto] = useState([]);
  const [tipo, setTipo] = useState("");
  const [actualizarLista, setActualizarLista] = useState(true);
  const [modalNuevoTipoProducto, setModalNuevoTipoProducto] = useState(false);
  const [modalEditarTipoProducto, setModalEditarTipoProducto] = useState(false);

  const [expandir, setExpandir] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    cargarTipos();
  }

  const cargarTipos = (busquedaNew = null, pageNew = null, limitNew = null)=>{
    const url = BASE_URL + "tiposProductos/buscar";
    
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
          setTiposProducto(resp.data.tiposProducto);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
          setDisabled(false);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarTipo = (tipo, editar = false, id = null) => {
    setDisabled(true);
    let message = GenerarMessage(("¿Esta seguro que desea "+ (editar?"editar":"guardar") +" este Tipo de Producto?"), ()=>saveTipo(tipo, editar, id), ()=>{setDisabled(false)}, "Guardar");
    notificar({
      msg: message, 
      type: "info", 
      autoClose: false,  
      closeOnClick: false
    }); 
  }

  const saveTipo = (tipo, editar, id) =>{
    const url = BASE_URL + 'tiposProductos/'
    getJWT()
    .then(({jwt})=>{
      const config = {headers:{authorization:jwt}};
      if(!editar){
        const nuevoTipo = {"tipoProducto": tipo};
        axios.post(url, nuevoTipo, config)
        .then((res) => {
          if (res.data.status === "ok"){
            notificar({ 
              msg: "Tipo de Prodcuto Guardado.",
              type: "success",
              callback: () => {  
                cargarTipos();
                setModalNuevoTipoProducto(false);
                setModalEditarTipoProducto(false);
              }
            });
          } else {
            notificar({ msg: error, type: "error", callback: () => setDisabled(false) });   
          }
        })
      }else{
        axios.put(url, {id, "tipoProducto": tipo}, config)
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok"){
            notificar({ 
              msg: "Tipo de Prodcuto Editado.",
              type: "success",
              callback: () => {
                cargarTipos();
                setModalNuevoTipoProducto(false);
                setModalEditarTipoProducto(false);
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

  const editar = (tipo) =>{
    datos = tipo;
    setModalEditarTipoProducto(true);
  }

  return(
    <>
      {ENV_LOADED?
        <>
          <div className='' style={{display:'flex', flexDirection:'row'}}>
            {modalNuevoTipoProducto && 
              <ModalTipoProducto
                titulo="Nuevo Tipo de Producto"
                guardarTipo={(tipo)=>guardarTipo(tipo)}
                salir={() => setModalNuevoTipoProducto(false)}
                disabled={disabled} 
              />
            }
            {modalEditarTipoProducto && 
              <ModalTipoProducto
                titulo="Editar Tipo de Producto"
                guardarTipo={(tipo, editar, id)=>guardarTipo(tipo, editar, id)}
                salir={() => setModalEditarTipoProducto(false)}
                datos={datos}
                editar={true}
                disabled={disabled} 
              />
            }
            <div style={{display:'flex', flex:1, flexDirection:'column'}}>
              <div style={{display:'flex', flex:1, placeContent:'center'}}>
                  <h2>LISTADO DE TIPOS DE PRODUCTOS</h2>          
              </div>
              <div className="Row">
                <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
                  Tipo: 
                  <TextField
                    style={{ margin:10, width:350}}
                    className='Dato'
                    label="Buscar Tipo"
                    variant="outlined"
                    value={busqueda}
                    onChange={(e) => {setBusqueda(e.target.value); cargarTipos(e.target.value);}}
                  />
                </div>
                <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
                  <Button variant="contained" className='Boton' onClick={() => { setModalNuevoTipoProducto(true) }}>Nuevo Tipo</Button>
                </div>   
                <div style={{display:'flex', flex:1}}>
                </div>        
              </div>       
              <div className='Listado' style={{display:'flex', flex:1, width:'99%'}}>
                {tiposProducto.length !== 0 ?
                  tiposProducto.map((tipo, index)=>{
                    return (
                      <div key={tipo.id} className="Listado">
                        <div className="Detalles">
                          <div style={{display:'flex', flexDirection:'row', 
                          alignItems:'center', justifyContent:'center', width:'100%'}}>
                            <div className="Row" style={{flex:2, placeContent:'space-between'}}>
                              <div style={{flex:1}}>
                                <strong> Tipo: </strong> {tipo.tipoProducto} 
                              </div>                          
                            </div>
                          </div>  
                          <div className="Acciones">
                            <Accion
                              icono="edit"
                              ayuda="Editar"
                              backgroundColor="#00a5e5"
                              disabled={disabled}
                              onClick={() => editar(tipo)}
                            />                        
                          </div>
                        </div>       
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
                cargar={(busqueda, newPage, newLimit)=>cargarTipos(busqueda, newPage, newLimit)}
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