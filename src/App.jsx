import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Bicicletas, Index, Login, Logout, Clientes, Proveedores } from './componentes/Main';
import { Header } from './componentes/comun/Main';
import './App.css'
import useEnv from './useEnv';

function App() {

  const [BASE_URL, BASENAME] = useEnv();
  const [logged, setLogged] = useState(false);

  const logeo = (value) => {
    setLogged(value);
  }

  return (
    <BrowserRouter basename={BASENAME}>
      <div className='App'>
        <Header logged={logged}/>
        <Routes>
          <Route path="/proveedores" element={<Proveedores logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
          <Route path="/bicicletas" element={<Bicicletas logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
          <Route path="/clientes" element={<Clientes logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
          <Route path="/login" element={<Login logeo={()=>logeo(true)} BASE_URL={BASE_URL}/>}/> 
          <Route path="/logout" element={<Logout logout={()=>logeo(false)} />}/>
          <Route path="/" element={<Index />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App