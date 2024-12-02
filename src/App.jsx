import { useState, useEffect} from 'react'
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { Arreglos, Bicicletas, Index, 
  Login, Logout, Clientes, 
  Marcas, Productos, Proveedores, Admin, Ventas, NuevaVenta, TiposProductos} from './componentes/Main';
import { Header } from './componentes/comun/Main';
import './App.css'
import useEnv from './useEnv';

import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { getJWT } from './componentes/comun/Funciones';

function App() {

  const [BASE_URL, BASENAME] = useEnv();
  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logeo = (value) => {
    setLogged(value);
  }

  const checkLogged = () =>{
    return new Promise((resolve, reject) => {      
      getJWT()
      .then((jwt, jwtData) =>{     
        resolve(jwt !== null);
      })
      .catch((error)=>{     
        reject();
      })
    })
  }

  const checkIsAdmin = () =>{
    getJWT()
    .then((jwt, jwtData) =>{
      return jwtData.datos.tipo === 2;
    })
    .catch((error)=>{
      return false;
    })
  }

  return (
    <BrowserRouter basename={BASENAME}>
      <div className='App'>
        <ToastContainer
          position='top-center'
          containerId="popup"
        />
        <Routes>
            <Route path="/login" element={<Login logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
              
            <Route path="/" element={ <Index checkLogged={()=>checkLogged()} /> }/> 
            
            <Route path="/logout" element={ <Logout checkLogged={()=>checkLogged()} logout={()=>logeo(false)} /> }/>

            <Route path="/productos" element={ <Productos checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            
            <Route path="/marcas" element={ <Marcas checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            
            <Route path="/tiposProductos" element={ <TiposProductos checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            
            <Route path="/proveedores" element={ <Proveedores checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

            <Route path="/bicicletas" element={ <Bicicletas checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

            <Route path="/clientes" element={ <Clientes checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

            <Route path="/admin" element={ <Admin checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

            <Route path="/arreglos" element={ <Arreglos checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

            <Route path="/ventas" element={ <Ventas checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            
            <Route path="/ventas/nueva" element={ <NuevaVenta checkLogged={()=>checkLogged()} logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App