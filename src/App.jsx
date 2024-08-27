import { useState, useEffect} from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Arreglos, Bicicletas, Index, 
  Login, Logout, Clientes, 
  Marcas, Productos, Proveedores, Admin } from './componentes/Main';
import { Header } from './componentes/comun/Main';
import './App.css'
import useEnv from './useEnv';

function App() {

  const [BASE_URL, BASENAME] = useEnv();
  const [logged, setLogged] = useState(false);

  const logeo = (value) => {
    setLogged(value);
  }

  const checkLogged = () =>{
    return sessionStorage.getItem('token')!== null;
  }

  useEffect(()=>{
    setLogged(checkLogged());
  },[])

  return (
    <BrowserRouter basename={BASENAME}>
      <div className='App'>
        <Header logged={logged}/>
        <Routes>
            <Route path="/login" element={<Login logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/>                  
            <Route path="/" Component={ () =>{
              if(checkLogged()) return <Index />
              else return <Navigate to="/login" replace={true}/>
            }}/>
            
            <Route path="/logout" Component={ () =>{
              if(checkLogged()) return <Logout logout={()=>logeo(false)} />
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/productos" Component={ () =>{
              if(checkLogged()) return <Productos logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>
            
            <Route path="/marcas" Component={ () =>{
              if(checkLogged()) return <Marcas logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/proveedores" Component={ () =>{
              if(checkLogged()) return <Proveedores logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/bicicletas" Component={ () =>{
              if(checkLogged()) return <Bicicletas logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/clientes" Component={ () =>{
              if(checkLogged()) return <Clientes logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/admin" Component={ () =>{
              if(checkLogged()) return <Admin logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>

            <Route path="/arreglos" Component={ () =>{
              if(checkLogged()) return <Arreglos logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>
              else return <Navigate to="/login" replace={true}/>
            }}/>
            
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App