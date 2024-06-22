import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField, InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {Accion, ModalNuevaMarca} from '../comun/Main';
import { useDatosCliente } from '../../hooks/useDatosCliente';

let controller = new AbortController();
let oldController;

export default function Index ({BASE_URL}){

  const [clientes, setClientes] = useState([]);
  const [datosCliente, setDatoCliente] = useDatosCliente(null);
  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();
  const [actualizarLista, setActualizarLista] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    dayjs.locale('es');
    recargarClientes();
  }

  const recargarClientes = function(){
    const url = BASE_URL + "clientes/listar";
    
    oldController = controller;
    oldController.abort();
    oldController = null;
    controller = new AbortController();

    const offset = (page-1)* limit;
    const config = {
      headers:{authorization: sessionStorage.getItem('token')},
      params:{limit, offset, busqueda},
      signal: controller.signal
    }
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        setClientes(resp.data.clientes);
        const paginasTotales = Math.ceil(resp.data.total / limit);
        setPaginasTotales(paginasTotales);
        setActualizarLista(false);
      }
    })
    .catch((error)=>{if(!axios.isCancel) alert(error);})
  }

  const handleChangePage = (newPage) => {
    setPage(newPage);
    setActualizarLista(true);
  };

  const handleChangeLimit = (event) => {
    setLimit(parseInt(event.target.value, 10));
    handleChangePage(1);
  };

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
          setActualizarLista(true);
        } else {
          alert("Error")
        }
      })
      .catch((error) => {
        alert("Error")
      })
    }
  }

  useEffect(() => {
    init();
  },[])

  useEffect(() =>{
    if(actualizarLista)
      recargarClientes();
  },[actualizarLista])
  

  return(
    <>   
    <div className='' style={{display:'flex', flexDirection:'row'}}>
      <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        <h2>DATOS NUEVO CLIENTE</h2>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Documento"
            variant="outlined"
            value={datosCliente.documento}
            onChange={(e) => setDatoCliente('documento', e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker 
              label="Fecha de Nacimiento" 
              value={dayjs(datosCliente.fechaNac)}
              views={['day', 'month', 'year']}
              onChange={(e) => setDatoCliente('fechaNac', e)}              
            />
          </LocalizationProvider>
        </div>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Apellidos"
            variant="outlined"
            value={datosCliente.apellidos}
            onChange={(e) => setDatoCliente('apellidos', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Nombres"
            variant="outlined"
            value={datosCliente.nombres}
            onChange={(e) => setDatoCliente('nombres', e.target.value)}
          />
        </div>
        <div className="Row" >      
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Direccion"
            variant="outlined"
            value={datosCliente.direccion}
            onChange={(e) => setDatoCliente('direccion', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Telefono"
            variant="outlined"
            value={datosCliente.telefono}
            onChange={(e) => setDatoCliente('telefono', e.target.value)}
          />
        </div>
        <div className="Row"> 
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="E-Mail"
            variant="outlined"
            value={datosCliente.email}
            onChange={(e) => setDatoCliente('email', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Instagram"
            variant="outlined"
            value={datosCliente.instagram}
            onChange={(e) => setDatoCliente('instagram', e.target.value)}
          />
        </div>        
        <div className='Botonera'>
          <Button variant="contained" className='Boton' onClick={() => { guardarCliente(datosCliente) }}>Guardar Nuevo Cliente</Button>
        </div> 
      </div>
      <div style={{display:'flex', flexDirection:'column', flex:1}}>
        <div className="Row" style={{height: 70, width:'99%'}}>
          <div style={{flex:1}}>
            <center><h2>LISTADO DE CLIENTES</h2></center>
          </div>
        </div>
        <div className="Row" style={{width:'99%'}}>
          <div style={{display:'flex', flex:1, placeItems:'center'}}>
            Documento: 
            <TextField
              style={{ flex: 1, margin:10 }}
              className='Dato'
              label="Buscar Documento"
              variant="outlined"
              value={busqueda}
              onChange={(e) => {setBusqueda(e.target.value); setActualizarLista(true);}}
            />
          </div>
        </div>        
        <div className='Listado' style={{display:'flex', flex:1, width:'98%'}}>
          {clientes.length !== 0 ?
            clientes.map((cliente, index)=>{
              const bicicletas = cliente.bicicletas;
              return (
                <>
                  <div className="Listado">
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
                </>
              );
            })
            :
            <center><strong>Sin Resultados</strong></center>
          }
        </div>
        <div style={{display:'flex', width:'100%', placeItems:'center', flexDirection:'column'}}>
          <div>            
            <Pagination 
              count={paginasTotales} 
              shape="rounded" 
              page={page} 
              onChange={(e, nuevaPag)=> handleChangePage(nuevaPag)}
              style={{marginTop:10}}
              />             
          </div>
          <div style={{display:'flex', flexDirection:'row', placeItems:'center'}}> 
          <InputLabel id="Reglabel" className="LabelPaginador" style={{textWrap: 'wrap',textAlign: 'center'}}>Registros por Pagina</InputLabel>
            <Select
              labelId="Reglabel"
              value={limit}
              onChange={(e)=>handleChangeLimit(e)}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}