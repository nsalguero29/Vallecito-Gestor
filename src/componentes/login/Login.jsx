import { useState } from 'react';
import { TextField, InputAdornment, IconButton} from '@mui/material';
import { Person, VpnKey, VisibilityOff, Visibility } from '@mui/icons-material';
import { Boton, Header } from '../comun/Main';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { getJWT } from '../comun/Funciones';

export default function Login({logeo, BASE_URL}){
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = () =>{
    //e.preventDefault();
    const popup = toast.loading("Ingresando..", {containerId: 'popup'});
    if(user != "" && pass != ""){
      const url = BASE_URL + "usuarios/login";
      axios.post(url, {user, pass})
      .then((resp)=>{
        //console.log({resp});        
        if(resp.data.status === "ok"){
          const { token } = resp.data;
          Cookies.set('jwt', token, { expires: 7 });
          toast.update(popup, { render: "Ingreso con exito", type: "success", isLoading: false,  autoClose: 2500, containerId: 'popup', onClose: () => {logeo(); navigate("/");} });
        } 
        else {
          toast.update(popup, { render: resp.data.error, type: "error", isLoading: false,  autoClose: 2500, containerId: 'popup' });
        }
      })
      .catch((error)=>{
        toast.update(popup, { render: error, type: "error", isLoading: false,  autoClose: 2500, containerId: 'popup' });
      })
    }else{
      toast.update(popup, { render: "Complete todos los campos", type: "error", isLoading: false,  autoClose: 2500, containerId: 'popup' });
    }
  }

  return(
    <div className='Login LoginContainer'>
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
          onClick={() => login()}
          color="#A3D0D0"
        >Ingresar</Boton>
      </form>
    </div>
  )
}