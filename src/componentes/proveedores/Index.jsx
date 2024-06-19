import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField, Autocomplete
} from '@mui/material';
import {Accion} from '../comun/Main';
import { useDatosProveedor } from '../../hooks/useDatosProveedor';

let controller = new AbortController();
let oldController;

export default function Index ({BASE_URL}){

  const [proveedores, setProveedores] = useState([]);
  const [datosProveedor, setDatoProveedor] = useDatosProveedor(null);
  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();

  useEffect(() => {
    const url = BASE_URL + "proveedores/listar";
    const config = {headers:{authorization: sessionStorage.getItem('token')}}
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        setProveedores(resp.data.proveedores);
      }
    })
  },[])

  const guardarProveedor = (datosProveedor) => {
    if (window.confirm("¿Esta seguro que desea registrar un proveedor?")){
      const url = BASE_URL + 'proveedores/'
      const config = {headers:{authorization:sessionStorage.getItem('token')}};
      axios.post(url, datosProveedor, config)
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
        <h2>DATOS NUEVO PROVEEDOR</h2>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Proveedor"
            variant="outlined"
            value={datosProveedor.apellidos}
            onChange={(e) => setDatoProveedor('proveedor', e.target.value)}
          />
        </div>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Contacto"
            variant="outlined"
            value={datosProveedor.apellidos}
            onChange={(e) => setDatoProveedor('nombreContacto', e.target.value)}
          />
        </div>
        <div className="Row" >      
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Direccion"
            variant="outlined"
            value={datosProveedor.direccion}
            onChange={(e) => setDatoProveedor('direccion', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Telefono"
            variant="outlined"
            value={datosProveedor.telefono}
            onChange={(e) => setDatoProveedor('telefono', e.target.value)}
          />
        </div>
        <div className="Row"> 
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="E-Mail"
            variant="outlined"
            value={datosProveedor.email}
            onChange={(e) => setDatoProveedor('email', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Instagram"
            variant="outlined"
            value={datosProveedor.instagram}
            onChange={(e) => setDatoProveedor('instagram', e.target.value)}
          />
        </div>        
        <div className='Botonera'>
          <Button variant="contained" className='Boton' onClick={() => { guardarProveedor(datosProveedor) }}>Guardar Nuevo Proveedor</Button>
        </div> 
      </div>
      <div style={{display:'flex', flex:1}}>
        <div className='Listado' style={{display:'flex', flex:1}}>
          <center><h2>LISTADO DE PROVEEDORES</h2></center>
          {proveedores?.map((proveedor, index)=>{
            const productos = proveedor.productos;
            return (
              <>
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
                        <div style={{flex:2}}>
                        <strong> Proveedor: </strong> {proveedor.proveedor} <strong> Telefono: </strong>  {proveedor.telefono} <strong> Productos: </strong> {productos.length}
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
                      <div>
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