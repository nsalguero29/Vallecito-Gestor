import { Button } from '@mui/material';
import { toast } from 'react-toastify';

export default function generarMessage (message, actionOk, closeAction = () =>{}, okMessage = "Actualizar"){

  const close = () =>{
    closeAction();
    toast.dismiss();
  }

  return(
    <div>
      <div className="Fila">
        <span>{message}</span>
      </div>
      <div className="Fila" style={{display:'flex', justifyContent:'space-evenly', marginTop:"10px"}}>
        <Button 
          type="submit" className="Boton" variant="contained" 
          onClick={actionOk}
        >{okMessage}</Button>
        <Button 
          type="submit" className="Boton" variant="contained" 
          onClick={()=>close()}
        >Cancelar</Button>
      </div>
    </div>
  )
}