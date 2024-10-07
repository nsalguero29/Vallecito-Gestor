import axios from 'axios';

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

export { 
    cargarMarcas, 
    cargarClientes,
    cargarProveedores
}