import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton} from '@mui/material';
import { Person, VpnKey, VisibilityOff, Visibility } from '@mui/icons-material';
import { Boton, Header } from '../comun/Main';
import './styles.css';
import axios from 'axios';
import { useLocation, useSearch } from "wouter";

import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import useEnv from '../../useEnv';

export default function Login({notificar, checkLogged}){
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [location, navigate] = useLocation();
  const {ENV_LOADED, BASE_URL} = useEnv();

  const login = () =>{
    if(user != "" && pass != ""){
      notificar({msg:"Ingresando.."});
      const url =  BASE_URL + "usuarios/login";
      axios.post(url, {user, pass})
      .then((resp)=>{
        if(resp.data.status === "ok"){
          const token = jwtDecode(resp.data.token);
          const user = token.data;
          Cookies.set('jwt', resp.data.token, { expires: 7 });
          Cookies.set('user', JSON.stringify(user));
          notificar({msg:"Ingreso con exito", type: "success", isLoading: false, callback: () => {checkLogged(); navigate("/")}})
        } 
        else {
          notificar({msg:resp.data.error, type: "error"});
        }
      })
      .catch((error)=>{
        notificar({msg:resp.data.error, type: "error"});
      })
    }else{
      notificar({msg:"Complete todos los campos", type: "error"});
    }
  }

  useEffect(() => {
    if (!ENV_LOADED) return;
  },[ENV_LOADED])

  return(
    <div className='Login LoginContainer'>
      <h2>VALLECITO GESTOR</h2>
      <form className='Formulario' action="#" onSubmit={login}>
        <h3>Inicie sesión</h3>
        <hr width="80%"/>
        <TextField 
          className="Input"
          style={{margin: '10px 0', width:'100%'}}  
          label="Usuario"
          placeholder="Usuario"
          value={user}
          required
          onChange={(e) => setUser(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"> <Person /> </InputAdornment>
          }}
        />
        <TextField 
          className="Input"
          style={{margin: '15px 0', width:'100%'}}
          label="Contraseña"
          placeholder="Contraseña"
          type={showPassword ? "text" : "password"}
          value={pass}
          required
          onChange={(e) => setPass(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"> <VpnKey /> </InputAdornment>,
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )
          }}
        />
        <Boton
          type="submit" className="Boton" variant="contained" 
          onClick={(e) => login(e)}
          color="#A3D0D0"
        >Ingresar</Boton>
      </form>
    </div>
  )
}