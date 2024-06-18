import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField, Autocomplete
} from '@mui/material';
import {Accion} from '../comun/Main';
import { useDatosCliente } from '../../hooks/useDatosCliente';

let controller = new AbortController();
let oldController;

function Tarjeta ({titulo, url, icono}){
  return(
    <Link to={url} className="Tarjeta">
      <span className="material-icons Icono">{icono}</span>      
      {titulo}
    </Link>
  )
}

export default function Index ({BASE_URL}){

  const [clientes, setClientes] = useState([]);
  const [datosCliente, setDatoCliente] = useDatosCliente(null);
  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  useEffect(() => {
    const url = BASE_URL + "clientes/listar";
    const config = {headers:{authorization: sessionStorage.getItem('token')}}
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        setClientes(resp.data.clientes);
      }
    })
  },[])

  const guardarCliente= (datosCliente) => {
    if (window.confirm("¿Esta seguro que desea registrar un cliente?")){
      const url = BASE_URL + 'clientes/nuevo'
      const config = {headers:{authorization:sessionStorage.getItem('token')}};
      axios.post(url, datosCliente, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "ok"){
          alert("Guardado");
          window.location.reload();
        } else {
          alert("Error")
        }
      })
      .catch((error) => {
        alert("Error")
      })
    }
  }

  return(
    <>   
    <div className='ContenedorPrincipal' style={{display:'flex', flexDirection:'row'}}>
      <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
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
            <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Fecha Nacimiento"
            variant="outlined"
            value={datosCliente.fechaNac}
            onChange={(e) => setDatoCliente('fechaNac', e.target.value)}
          />
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
        </div>
        <div className="Row">
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
      <div style={{display:'flex', flex:1}}>
        <div className='Listado' style={{display:'flex', flex:1}}>
          <center><h2>LISTADO DE CLIENTES</h2></center>
          {clientes?.map((cliente, index)=>{
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
                        <ul style={{paddingLeft:25, marginRight: 205}}>
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
          })}
        </div>
      </div>
    </div>
    </>
  )
}