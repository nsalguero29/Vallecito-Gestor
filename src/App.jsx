import { useState, useEffect, useRef} from 'react'
import { Router, Route, Switch, Redirect, useLocation } from 'wouter';

import { Arreglos, Bicicletas, Index, 
  Login, Logout, Clientes, 
  Marcas, Productos, Proveedores, Admin, Ventas, NuevaVenta, TiposProductos} from './componentes/Main';

import './App.css'
import useEnv from './useEnv';
import React from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { Header } from './componentes/comun/Main';
import { getJWT } from './componentes/comun/Funciones';

function App() {
  const {ENV_LOADED, BASENAME} = useEnv();
  const toastId = useRef(null);
  const [location, navigate] = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  const [logged, setLogged] = useState(null);
  const [user, setUser] = useState(null);

  const checkLogged = () =>{
    return new Promise((resolve, reject) => {      
      getJWT()
      .then(({jwt, jwtData}) =>{     
        resolve(jwt !== null);
      })
      .catch((error)=>{     
        reject();
      })
    })
  }

  const checkIsAdmin = () =>{
    getJWT()
    .then(({jwt, jwtData}) =>{
      return jwtData.datos.tipo === 2;
    })
    .catch((error)=>{
      return false;
    })
  }

  const notificar = ({msg, type = "info", autoClose = 1500, 
    isLoading = false, callback = null, closeOnClick = true, closeButton = false}) => {
    if (!toast.isActive(toastId.current)) {
      toastId.current = toast(msg, { 
        type, isLoading, autoClose,
        closeOnClick, 
        containerId:'popup', toastId, 
        closeButton,
        onClose: () => {callback ? callback() : null}
      });
    } else {
      toast.update(toastId.current, { 
        type, isLoading, autoClose,
        closeOnClick, render:msg,
        containerId:'popup', toastId,
        closeButton, 
        onClose: () => {callback ? callback() : null}
      });
    }
  }

  useEffect(() => {
    if (!ENV_LOADED) return;
    const {logged, user} = getJWT();
    setLogged(logged);
    if (logged) setUser(user)
  },[ENV_LOADED])

  return (
    <>
      <ToastContainer
          containerId="popup"
          position="top-center"
          rtl={false}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          theme="colored"
          transition={Slide}
          autoClose={1500}
          newestOnTop={true}
          closeOnClick={false}
          draggable={false}
        /> 
      {ENV_LOADED ?
        <div className='App'>
          <Router base={BASENAME}>
            <Header isAdmin={false}/>
            <Switch>
                  <Route path="/login" >
                    <Login notificar={notificar} />
                  </Route> 
                  <Route path="/" > 
                    <Index notificar={notificar} checkLogged={()=>checkLogged()} />
                  </Route>
                  <Route path="/productos" > 
                    <Productos notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>                  
                  <Route path="/marcas" > 
                    <Marcas notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>                  
                  <Route path="/tiposProductos" > 
                    <TiposProductos notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>                  
                  <Route path="/proveedores" > 
                    <Proveedores notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>
                  <Route path="/bicicletas" > 
                    <Bicicletas notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>
                  <Route path="/clientes" > 
                    <Clientes notificar={notificar} checkLogged={()=>checkLogged()} />
                  </Route>
                  <Route path="/admin" > 
                    <Admin notificar={notificar} checkLogged={()=>checkLogged()} />
                  </Route>
                  <Route path="/arreglos" > 
                    <Arreglos notificar={notificar} checkLogged={()=>checkLogged()} />
                  </Route>
                  <Route path="/ventas" > 
                    <Ventas notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>                  
                  <Route path="/ventas/nueva" >
                    <NuevaVenta notificar={notificar} checkLogged={()=>checkLogged()} />
                  </Route>
                  <Route path="/logout" > 
                    <Logout notificar={notificar} checkLogged={()=>checkLogged()}/>
                  </Route>
                  <Route>
                    <div>404</div>
                  </Route>
            </Switch> 
          </Router>
        </div>
      :
        <span>Cargando...</span>
      }
  </>
  )
}

export default App