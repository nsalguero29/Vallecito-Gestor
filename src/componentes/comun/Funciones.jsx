import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Button
} from '@mui/material';

const cargarMarcas = (BASE_URL) => {
  new Promise((resolve, reject) => { 
    const url = BASE_URL + "marcas/listar";
    const config = {
      headers:{authorization: sessionStorage.getItem('token')}      
    }
    axios.get(url, config)
    .then((resp)=>{   
      if(resp.data.status === "ok"){
        resolve(resp.data.marcas);
      }
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
    const config = {
        headers:{authorization: sessionStorage.getItem('token')}      
    }
    axios.get(url, config)
    .then((resp)=>{
        if(resp.data.status === "ok"){
          resolve(resp.data.clientes);
        }
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
    const config = {
      headers:{authorization: sessionStorage.getItem('token')}      
    }
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        resolve (resp.data.proveedores);
      }
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

export { 
    cargarMarcas, 
    cargarClientes,
    cargarProveedores,
    showToast
}