import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Button
} from '@mui/material';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const cargarMarcas = (BASE_URL) => {
  new Promise((resolve, reject) => { 
    const url = BASE_URL + "marcas/listar";
    getJWT()
    .then((jwt)=>{      
      const config = {
        headers:{authorization: jwt}      
      }
      axios.get(url, config)
      .then((resp)=>{   
        if(resp.data.status === "ok"){
          resolve(resp.data.marcas);
        }
      })
    })
    .catch((error)=>{
      if(!axios.isCancel) reject(error);
      reject(error);
    })
  })
}

const cargarClientes = (BASE_URL) => {
  new Promise((resolve, reject) => { 
    const url = BASE_URL + "clientes/listar";
    getJWT()
    .then((jwt)=>{      
      const config = {
        headers:{authorization: jwt}      
      }
      axios.get(url, config)
      .then((resp)=>{
        if(resp.data.status === "ok"){
          resolve(resp.data.clientes);
        }
      })
    })
    .catch((error)=>{
      if(!axios.isCancel) reject(error);
      reject(error);
    })
  })
}

const cargarProveedores = (BASE_URL) => {
  new Promise((resolve, reject) => {
    const url = BASE_URL + "proveedores/listar";
    getJWT()
    .then((jwt)=>{      
      const config = {
        headers:{authorization: jwt}      
      }
      axios.get(url, config)
      .then((resp)=>{
        if(resp.data.status === "ok"){
          resolve (resp.data.proveedores);
        }
      })
    })
    .catch((error)=>{
      if(!axios.isCancel) reject(error);})
  })
}

const Msg = ({ message, saveData, cancel }) => (
  <div>
    <div className="Fila">
      <span>{message}</span>
    </div>
    <div className="Fila" style={{display:'flex', justifyContent:'space-evenly'}}>
      <Button 
        type="submit" className="Boton" variant="contained" 
        onClick={saveData}
      >Actualizar</Button>
      <Button 
        type="submit" className="Boton" variant="contained" 
        onClick={cancel}
      >Cancelar</Button>
    </div>
  </div>
);

const showToast = (msg, saveData, popup) =>{
  toast.update( popup, 
    {
      render:
        <Msg 
          message={msg}
          saveData={saveData} 
          cancel={()=>{
            setDisabled(false);
          }} 
        />
      ,
      containerId: 'popup', 
      autoClose:false
    })
}

const checkTokenExpirado = function(fechaString) {
  return new Promise((resolve, reject) => {
    const fechaActual = new Date();
    const fechaExpiracion = new Date(fechaString);
    if (fechaExpiracion.getTime() * 1000 < fechaActual.getTime()) {
        Cookies.clear();
        return reject("La fecha ha expirado");
    } else {
        return resolve();
    }
  })
}

const getJWT = function() {
  return new Promise((resolve, reject) => {
    const jwt = Cookies.get('jwt');
    if (jwt) {
      const jwtData = jwtDecode(jwt); 
      //console.log({jwtData});      
      checkTokenExpirado(jwtData.exp)
      .then(()=>{
        return resolve({jwt, jwtData});
      })
      .catch(()=>{
        return reject("Token expirado");
      })
    }else{
      return reject("Sin token");
    }
  })
}

export { 
    cargarMarcas, 
    cargarClientes,
    cargarProveedores,
    showToast,
    getJWT
}