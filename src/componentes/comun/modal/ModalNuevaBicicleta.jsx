import BaseModal from "./BaseModal";
import { 
    Button,
    TextField,
    Autocomplete
  } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDatosBicicleta } from '../../../hooks/useDatosBicicleta';

export default function ModalGenerado ({guardarBicicleta, salir, 
  marcasLista, titulo}){

    const [datosBicicleta, setDatoBicicleta] = useDatosBicicleta(null);

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        <div className="Row">
          <Autocomplete
              value={datosBicicleta.marcaId}
              onChange={(e,n) => {setDatoBicicleta('marcaId', n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={marcasLista}
              getOptionLabel={(option) => option.marca}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Marca"/>}
            />
          <div style={{flex:'flex', placeItems:'center', placeContent:'center'}}>
            
          </div>
        </div>
        <div className="Linea" style={{display:'flex', placeContent:'center'}}>
          <Button variant="contained" className='Boton' onClick={() => { salir(); guardarBicicleta(datosBicicleta); }}>Guardar Nueva Bicicleta</Button>
        </div>
        </div>
        </BaseModal>
    )
}