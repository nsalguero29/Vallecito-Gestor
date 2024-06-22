import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Button, TextField
} from '@mui/material';
import dayjs from 'dayjs';

import {Accion, ModalNuevaMarca, Paginador} from '../comun/Main';

let controller = new AbortController();
let oldController;

export default function Index ({BASE_URL}){

  const [marcas, setMarcas] = useState([]);
  const [nombreMarca, setNombreMarca] = useState("");
  const [actualizarLista, setActualizarLista] = useState(true);
  const [modalNuevaMarca, setModalNuevaMarca] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [paginasTotales, setPaginasTotales] = useState(0);

  const init = function(){
    dayjs.locale('es');
    recargarMarcas();
  }

  const recargarMarcas = function(){
    const url = BASE_URL + "marcas/listar";
    
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
        setMarcas(resp.data.marcas);
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

  const guardarMarca= () => {
    if (window.confirm("¿Esta seguro que desea guardar una nueva marca?")){
      const url = BASE_URL + 'marcas/'
      const config = {headers:{authorization:sessionStorage.getItem('token')}};
      const nuevaMarca = {"marca": nombreMarca};
      console.log(nuevaMarca);
      axios.post(url, nuevaMarca, config)
      .then((res) => {
        if (res.data.status === "ok"){
          alert("Guardado");
          setActualizarLista(true);
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

  useEffect(() =>{
    if(actualizarLista)
      recargarMarcas();
  },[actualizarLista])
  

  return(
    <>   
    <div className='' style={{display:'flex', flexDirection:'row'}}>
      <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        {modalNuevaMarca && 
          <ModalNuevaMarca
            titulo="Nueva Marca"
            nombreMarca={nombreMarca}
            setNombreMarca= {(nombreMarca)=>setNombreMarca(nombreMarca)}
            guardarMarca={()=>guardarMarca()}
            salir={() => setModalNuevaMarca(false)}
          />
        }
         
        <div className="Row">
          <div style={{flex:1}}>
            <center><h2>LISTADO DE MARCAS</h2></center>
          </div>
        </div>
        <div className='Botonera'>
          <Button variant="contained" className='Boton' onClick={() => { setModalNuevaMarca(true) }}>Nueva Marca</Button>
        </div>
        <div className="Row">
          <div style={{display:'flex', flex:1, placeItems:'center'}}>
            <TextField
              style={{ flex: 1, margin:10 }}
              className='Dato'
              label="Buscar Marca"
              variant="outlined"
              value={busqueda}
              onChange={(e) => {setBusqueda(e.target.value); setActualizarLista(true);}}
            />
          </div>
        </div>        
        <div className='Listado'>
          {marcas.length !== 0 ?
            marcas.map((marca, index)=>{
              const productos = marca.productos;
              return (
                <>
                  <div key={marca.id} className="Listado">
                    <div className="Detalles">
                      <div style={{display:'flex', flexDirection:'row', 
                      alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <div style={{display:'flex', flex:1, 
                        flexDirection:'row', width:'100%'}}>
                          <div style={{flex:2}}>
                          <strong> Marca: </strong> {marca.marca}
                          </div>
                        </div>
                      </div>
                      <div>
                        <strong>Productos: </strong>
                        <ul style={{paddingLeft:25}}>
                          {productos.map((producto, index) => {
                            return(
                              <>
                                <div key={index} className="Row" style={{placeItems:'center'}}>
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
                                    {producto.producto}<strong>{" (" + producto.stock + ")"}</strong>
                                  </div>
                                </div>
                              </>
                            )
                          })}
                        </ul>
                      </div>
                      <div className="Acciones">
                        
                      </div>
                    </div>                
                  </div>
                </>
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
          handleChangePage={(nuevaPag)=>handleChangePage(nuevaPag)}
          handleChangeLimit={(newLimit)=>handleChangeLimit(newLimit)}
          opciones={[5,15,25,50]}
        />
      </div>
    </div>
    </>
  )
}