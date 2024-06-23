import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField, Autocomplete
} from '@mui/material';
import dayjs from 'dayjs';
import {Accion, Paginador, ModalNuevoProducto} from '../comun/Main';

let controller = new AbortController();
let oldController;

export default function Index ({BASE_URL}){
  
  const [productos, setProductos] = useState([]);
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false);

  const [expandir, setExpandir] = useState();
  const [expandir2, setExpandir2] = useState();
  const [actualizarLista, setActualizarLista] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    dayjs.locale('es');
    recargarProductos();
  }

  const recargarProductos = function(){
    const url = BASE_URL + "productos/listar";
    
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
        setProductos(resp.data.productos);
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

  const handleChangeLimit = (newLimit) => {
    setLimit(parseInt(newLimit, 10));
    handleChangePage(1);
  };

  const guardarProducto = (datosProducto) => {
    if (window.confirm("¿Esta seguro que desea registrar un producto?")){
      const url = BASE_URL + 'productos/'
      const config = {headers:{authorization:sessionStorage.getItem('token')}};
      axios.post(url, datosProducto, config)
      .then((res) => {
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
      recargarProductos();
  },[actualizarLista])

  return(
    <div className='' style={{display:'flex', flexDirection:'row'}}>
      {modalNuevoProducto && 
        <ModalNuevoProducto
          titulo="Nuevo Proveedor"
          guardarProveedor={(datosProducto)=>guardarProducto(datosProducto)}
          salir={() => setModalNuevoProducto(false)}
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
              onChange={(e) => {setBusqueda(e.target.value); setActualizarLista(true);}}
            />
          </div>
          <div style={{display:'flex', flex:1, placeItems:'center', placeContent:'center'}}>
            <Button variant="contained" className='Boton' onClick={() => { setModalNuevoProducto(true) }}>Nuevo Producto</Button>
          </div>   
          <div style={{display:'flex', flex:1}}>
          </div>        
        </div>
        <div className='Listado' style={{display:'flex', flex:1,  width:'99%'}}>
          {productos?.map((producto, index)=>{
            const proveedores = producto.proveedores;
            return (
              <div key={producto.id} className="Listado">
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
                          <strong> Producto: </strong> {producto.producto} 
                        </div>
                        <div style={{flex:1}}>
                          <strong> Stock: </strong>  {producto.stock} 
                        </div>
                        <div style={{flex:1}}>
                          <strong> Proveedores: </strong> {proveedores?.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="Acciones">
                    
                  </div>
                </div>
                {/*expandir === index &&
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
                    }
                  </div>
                */}
              </div>
            );
          })}
        </div>
        <Paginador
          page={page}
          limit={limit}
          paginasTotales={paginasTotales}
          handleChangePage={(nuevaPag)=>handleChangePage(nuevaPag)}
          handleChangeLimit={(newLimit)=>handleChangeLimit(newLimit)}
          opciones={[5,10,15,25,50]}
        />
      </div>
    </div>
  )
}