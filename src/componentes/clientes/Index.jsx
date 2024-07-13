import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Paginador, ModalNuevoCliente} from '../comun/Main';

let controller = new AbortController();
let oldController;
dayjs.locale('es');

export default function Index ({BASE_URL}){

  const [clientes, setClientes] = useState([]);
  const [modalNuevoCliente, setModalNuevoCliente] = useState(false);

  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = () => {
    cargarClientes();
  }

  const cargarClientes = (busquedaNew = null, pageNew = null, limitNew = null) => {
    const url = BASE_URL + "clientes/buscar";
    
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
        setClientes(resp.data.clientes);
        const paginasTotales = Math.ceil(resp.data.total / limite);
        setPaginasTotales(paginasTotales);        
      }
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarCliente= (datosCliente) => {
    if (window.confirm("¿Esta seguro que desea registrar un cliente?")){
      const url = BASE_URL + 'clientes/'
      const config = {headers:{authorization:sessionStorage.getItem('token')}};
      console.log({datosCliente});
      axios.post(url, datosCliente, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "ok"){
          alert("Guardado");
          cargarClientes();
        } else {
          alert("Error")
        }
      })
      .catch((error) => {
        alert(error)
      })
    }
  }

  useEffect(() => {
    init();
  },[]) 

  return(
    <div className='' style={{display:'flex', flexDirection:'column'}}>
      {modalNuevoCliente && 
        <ModalNuevoCliente
          titulo="Nuevo Cliente"
          guardarCliente={(datosCliente)=>guardarCliente(datosCliente)}
          salir={() => setModalNuevoCliente(false)}
        />
      }
      <div style={{display:'flex', flex:1, flexDirection:'column'}}>
        <div style={{display:'flex', flex:1, placeContent:'center'}}>
            <h2>LISTADO DE CLIENTES</h2>          
        </div>
        <div className="Row">
          <div style={{display:'flex', flex:1, placeItems:'center', marginLeft:10}}>
            Documento: 
            <TextField
              style={{ margin:10, width:350}}
              className='Dato'
              label="Buscar Documento"
              variant="outlined"
              value={busqueda}
              onChange={(e) => {setBusqueda(e.target.value); cargarClientes(e.target.value);}}
            />
          </div>
          <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
            <Button variant="contained" className='Boton' onClick={() => { setModalNuevoCliente(true) }}>Nuevo Cliente</Button>
          </div>   
          <div style={{display:'flex', flex:1}}>
          </div>        
        </div>
        <div className='Listado' style={{display:'flex', flex:1, width:'99%'}}>
          {clientes.length !== 0 ?
            clientes.map((cliente, index)=>{
              const bicicletas = cliente.bicicletas;
              return (
                <div key={cliente.id} className="Listado">
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
                        <div style={{flex:2}}>
                        <strong> Cliente: </strong> {cliente.apellidos}, {cliente.nombres} <strong> Telefono: </strong>  {cliente.telefono} <strong> Bicicletas: </strong> {bicicletas.length}
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
                            <strong>Documento: </strong> {cliente.documento}
                          </span>
                          <span>
                            <strong>Apellidos: </strong> {cliente.apellidos}
                          </span>
                          <span>
                            <strong>Nombres: </strong> {cliente.nombres}
                          </span>
                          <span>
                            <strong>Fecha Nacimiento: </strong> {cliente.fechaNac}
                          </span>
                        </div>
                        <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                          <span>
                            <strong>Direccion: </strong> {cliente.direccion}
                          </span>
                          <span>
                            <strong>Email: </strong> {cliente.email}
                          </span>
                          <span>
                            <strong>Instagram: </strong> {cliente.instagram}
                          </span>
                        </div>
                      </div>
                      <div>
                        <strong>Bicicletas: </strong>
                        <ul style={{paddingLeft:25}}>
                          {bicicletas.map((bicicleta, index2) => {
                            return(
                              <>
                                <div key={index2} className="Row" style={{placeItems:'center'}}>
                                  <div style={{flex:1, margin:'0px 4px', maxWidth:30}}>
                                    <Accion
                                      icono={expandir2 === index2 ? 'keyboard_arrow_up': 'keyboard_arrow_down'}
                                      ayuda="Expandir"
                                      backgroundColor={"lightgrey"}
                                      disabled={false}
                                      onClick={() =>{expandir2 === index2 ? setExpandir2() : setExpandir2(index2)}}
                                    />
                                  </div>
                                  <div style={{flex:1}}>
                                    {bicicleta.modelo}<strong>{" (" + bicicleta.rodado + ")"}</strong>
                                  </div>
                                </div>
                                {expandir2 === index2 &&
                                  //EXPANDIR CON LOS ARREGLOS DE LA BICI?
                                  <div style={{display:'flex', flexDirection:'row'}}>
                                    <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                                      <span>
                                        <strong>Documento: </strong> {cliente.documento}
                                      </span>
                                    </div>
                                    <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                                      <span>
                                        <strong>Direccion: </strong> {cliente.direccion}
                                      </span>
                                    </div>
                                  </div>
                                }
                              </>
                            )
                          })}
                        </ul>
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
          cargar={(busqueda, newPage, newLimit)=>cargarClientes(busqueda, newPage, newLimit)}
          opciones={[10,15,25,50]}
        />
      </div>
    </div>
  )
}