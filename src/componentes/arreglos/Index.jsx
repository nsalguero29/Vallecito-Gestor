import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Header, Paginador} from '../comun/Main';
import { getJWT } from '../comun/Funciones';
import { useLocation } from 'wouter';


let controller = new AbortController();
let oldController;
dayjs.locale('es');

export default function Index ({notificar, checkLogged}){
  const {ENV_LOADED, BASE_URL} = useEnv();
  
  const [location, navigate] = useLocation(); 
   
  useEffect(() => { 
    if (!ENV_LOADED) return;
    checkLogged()
    .then(()=>{
      init();  
    })
    .catch((error)=>{
      navigate('/login');
    })
  }, [ENV_LOADED])

  const [arreglos, setArreglos] = useState([]);
  const [modalNuevoArreglo, setModalNuevoArreglo] = useState(false);

  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = () => {
    cargarArreglos();
  }

  const cargarArreglos = (busquedaNew = null, pageNew = null, limitNew = null) => {
    const url = BASE_URL + "arreglos/buscar";
    
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
          setArreglos(resp.data.arreglos);
          const paginasTotales = Math.ceil(resp.data.total / limite);
          setPaginasTotales(paginasTotales);
        }
      })
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const guardarBicicleta = (datosBicicleta) => {
    if (window.confirm("¿Esta seguro que desea registrar una bicicleta?")){
      const url = BASE_URL + 'bicicletas/'
      getJWT()
      .then(({jwt})=>{        
        const config = {headers:{authorization:jwt}};
        axios.post(url, datosBicicleta, config)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === "ok"){
            alert("Guardado");
            cargarBicicletas();
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

  useEffect(() => {
    init();
  },[])  

  return(
    <>
      {ENV_LOADED?
        <>
          <Header isAdmin={false}/>
          <div className='' style={{display:'flex', flexDirection:'column'}}>
            {modalNuevoArreglo && 
              <ModalNuevoCliente
                titulo="Nuevo Arrglo"
                guardarBicicleta={(datosBicicleta)=>guardarBicicleta(datosBicicleta)}
                salir={() => setModalNuevoArreglo(false)}
              />
            }
            <div style={{display:'flex', flex:1, flexDirection:'column'}}>
              <div style={{display:'flex', flex:1, placeContent:'center'}}>
                  <h2>LISTADO DE ARREGLOS</h2>          
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
                    onChange={(e) => {setBusqueda(e.target.value); cargarBicicletas(e.target.value);}}
                  />
                </div>
                <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
                  <Button variant="contained" className='Boton' onClick={() => { setModalNuevoArreglo(true) }}>Nuevo Arreglo</Button>
                </div>   
                <div style={{display:'flex', flex:1}}>
                </div>        
              </div>
              <div className='Listado' style={{display:'flex', flex:1, width:'99%'}}>
                {arreglos.length !== 0 ?
                  arreglos.map((arreglo, index)=>{
                    const bicicleta = arreglo.bicicleta;
                    const cliente = bicicleta.cliente;
                    return (
                      <div key={arreglo.id} className="Listado" style={{}}>
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
                              <div className="Row" style={{flex:2, placeContent:'space-between'}}>
                                <div style={{flex:2}}>
                                  <strong> Trabajo: </strong> {arreglo.trabajo}
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Estado: </strong> {arreglo.estado}
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Valor: </strong> {arreglo.valorArreglo}
                                </div>
                                <div style={{flex:1}}>
                                  <strong> Cliente: </strong> {cliente.apellidos}, {cliente.nombres}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="Acciones">
                            
                          </div>
                        </div>
                        {expandir === index &&
                          <div className="Preguntas">
                            <div style={{display:'flex', flexDirection:'row', paddingLeft: 50}}>
                              <strong>BICICLETA: </strong>
                              <div style={{display:'flex', flexDirection:'row', paddingLeft: 50}}>
                                <div className="Row" style={{flex:1, display:'flex', flexDirection:'column'}}>
                                  <div style={{flex:1}}>
                                    <strong> Modelo: </strong> {bicicleta.modelo} <strong>({bicicleta.rodado})</strong>
                                  </div>
                                  <div style={{flex:1}}>
                                    <strong> Cuadro: </strong> {bicicleta.cuadro}
                                  </div>
                                  <div style={{flex:1}}>
                                    <strong> Arreglos: </strong> {arreglos.length}
                                  </div>
                                  <div style={{flex:1}}>
                                    <strong> Cliente: </strong> {cliente.apellidos}, {cliente.nombres}
                                  </div>
                                </div>
                              </div>
                              <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                              </div>
                              <div style={{flex: 1, display:'flex', flexDirection:'column'}}>
                                <strong>CLIENTE: </strong>
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
                                  <strong> Telefono: </strong>  {cliente.telefono} 
                                </span>
                                <span>
                                  <strong>Email: </strong> {cliente.email}
                                </span>
                                <span>
                                  <strong>Instagram: </strong> {cliente.instagram}
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
                cargar={(busqueda, newPage, newLimit)=>cargarArreglos(busqueda, newPage, newLimit)}
                opciones={[10,15,25,50]}
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