import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { TextField, InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

function Tarjeta ({titulo, url, icono}){
  return(
    <Link to={url} className="Tarjeta">
      <span className="material-icons Icono">{icono}</span>
      
      {titulo}
    </Link>
  )
}

export default function Index ({BASE_URL}){

  const [bicicletas, setBicicletas] = useState([]);

  useEffect(() => {
    const url = BASE_URL + "bicicletas/listar";
    const config = {};
    /*const config = {headers:{authorization: sessionStorage.getItem('token')},
                    params:{documento}}*/
    axios.get(url, config)
    .then((resp)=>{
      if(resp.data.status === "ok"){
        console.log(resp.data);
        setBicicletas(resp.data.bicicletas);
      }
    })
  },[])

  return(
    <div className='Listado'>
        {bicicletas?.map((bici, i)=>{
          return (
            <div key={bici.id}>
              <span>MODELO: {bici.modelo} </span>
              <span>RODADO: {bici.rodado} </span>
              <span>OBSERVACIONES: {bici.observacion} </span>
            </div>
          );
        })}
        {/* <Tarjeta url="/escanear" titulo="Escanear documento" icono="qr_code_scanner"/> */}
    </div>
  )
}