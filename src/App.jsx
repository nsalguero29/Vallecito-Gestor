import { useState, useEffect} from 'react'
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { Arreglos, Bicicletas, Index, 
  Login, Logout, Clientes, 
  Marcas, Productos, Proveedores, Admin } from './componentes/Main';
import { Header } from './componentes/comun/Main';
import './App.css'
import useEnv from './useEnv';

import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [BASE_URL, BASENAME] = useEnv();
  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logeo = (value) => {
    setLogged(value);
  }

  const checkLogged = () =>{
    return sessionStorage.getItem('token')!== null;
  }

  const checkIsAdmin = () =>{
    if(sessionStorage.getItem('datos') !== null){
      const datos = JSON.parse(sessionStorage.getItem('datos'));
      return datos.tipo === 1;
    }else{
      return false;
    }
  }

  useEffect(()=>{
    setLogged(checkLogged());    
  },[])
  
  useEffect(()=>{    
    setIsAdmin(checkIsAdmin());
  },[logged])

  return (
    <BrowserRouter basename={BASENAME}>
      <div className='App'>
        <ToastContainer
          position='top-center'
          containerId="popup"
        />
        <Header logged={logged} isAdmin={isAdmin}/>
        <Routes>
            <Route path="/login" element={<Login logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
            {checkLogged()?
            <>
              <Route path="/" element={ <Index /> }/>
              
              <Route path="/logout" element={ <Logout logout={()=>logeo(false)} /> }/>

              <Route path="/productos" element={ <Productos logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
              
              <Route path="/marcas" element={ <Marcas logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

              <Route path="/proveedores" element={ <Proveedores logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

              <Route path="/bicicletas" element={ <Bicicletas logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

              <Route path="/clientes" element={ <Clientes logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

              <Route path="/admin" element={ <Admin logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>

              <Route path="/arreglos" element={ <Arreglos logeo={()=>logeo(true)} BASE_URL={BASE_URL}/> }/>
            </>
            :
              <Route path="/" element={<Login logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
            }
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App