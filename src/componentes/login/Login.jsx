import { useState } from 'react';
import { TextField, InputAdornment, IconButton} from '@mui/material';
import { Person, VpnKey, VisibilityOff, Visibility } from '@mui/icons-material';
import { Boton } from '../comun/Main';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({logeo, BASE_URL}){
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = () =>{
    if(user != "" && pass != ""){
      const url = BASE_URL + "usuarios/login";
      axios.post(url, {user, pass})
      .then((resp)=>{
        if(resp.data.status === "ok"){
          sessionStorage.setItem('datos', JSON.stringify(resp.data.user))
          sessionStorage.setItem('token', resp.data.token)
          logeo();
          navigate("/entrega");
        } 
        else {
          alert(resp.data.error);
        }
      })
      .catch((error)=>{
        console.log(error);
        alert(error);
      })
    }else{
      alert("Complete datos de ingreso")
    }
  }

  return(
    <div className='Login LoginContainer'>
      <div className='Formulario'>
        <h3>Inicie sesión</h3>
        <hr width="80%"/>
        <TextField 
          style={{margin: '10px 0', width:'100%'}}  
          label="Usuario"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"> <Person /> </InputAdornment>
          }}
        />
        <TextField 
          style={{margin: '15px 0', width:'100%'}}
          label="Contraseña"
          placeholder="Contraseña"
          type={showPassword ? "text" : "password"}
          value={pass}
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
          onClick={() => login()}
          color="#A3D0D0"
        >Ingresar</Boton>
      </div>
    </div>
  )
}