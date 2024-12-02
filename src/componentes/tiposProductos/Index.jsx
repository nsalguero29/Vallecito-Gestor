import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import { getJWT } from '../comun/Funciones';
import { useNavigate } from 'react-router-dom';

import {Accion, Header, Paginador} from '../comun/Main';
import ModalTipoProducto from './ModalTipoProducto';

let controller = new AbortController();
let oldController;
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

  const [tiposProducto, setTiposProducto] = useState([]);
  const [tipo, setTipo] = useState("");
  const [actualizarLista, setActualizarLista] = useState(true);
  const [modalNuevoTipoProducto, setModalNuevoTipoProducto] = useState(false);

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
          setTiposProducto(resp.data.tiposProducto);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarTipo= () => {
    if (window.confirm("¿Esta seguro que desea guardar una nueva marca?")){
      const url = BASE_URL + 'tiposProductos/'
      getJWT()
      .then((jwt)=>{        
        const config = {headers:{authorization:jwt}};
        const nuevoTipo = {"tipoProducto": tipo};
        axios.post(url, nuevoTipo, config)
        .then((res) => {
          if (res.data.status === "ok"){
            alert("Guardado");
            cargarTipos();
          } else {
            alert("Error")
          }
        })
      })
      .catch((error) => {
        alert(error)
      })
    }
  }

  return(
    <>
      <Header isAdmin={false}/>
      <div className='' style={{display:'flex', flexDirection:'row'}}>
        {modalNuevoTipoProducto && 
          <ModalTipoProducto
            titulo="Nuevo Tipo de Producto"
            tipo={tipo}
            setTipo= {(tipo)=>setTipo(tipo)}
            guardarTipo={()=>guardarTipo()}
            salir={() => setModalNuevoTipoProducto(false)}
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
  )
}