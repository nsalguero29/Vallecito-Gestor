import BaseModal from '../comun/modal/BaseModal';
import { 
    Button,
    TextField
  } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDatosCliente } from '../../hooks/useDatosCliente';

export default function ModalCliente ({guardarCliente, salir, titulo}){

    const [datosCliente, setDatoCliente] = useDatosCliente(null);

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Documento"
            variant="outlined"
            value={datosCliente.documento}
            onChange={(e) => setDatoCliente('documento', e.target.value)}
          />
          <div style={{flex:'flex', placeItems:'center', placeContent:'center'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker               
                label="Fecha de Nacimiento" 
                value={dayjs(datosCliente.fechaNac)}
                views={['day', 'month', 'year']}
                onChange={(e) => setDatoCliente('fechaNac', e)}              
              />
            </LocalizationProvider>
          </div>

        </div>
        <div className="Row">
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Apellidos"
            variant="outlined"
            value={datosCliente.apellidos}
            onChange={(e) => setDatoCliente('apellidos', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Nombres"
            variant="outlined"
            value={datosCliente.nombres}
            onChange={(e) => setDatoCliente('nombres', e.target.value)}
          />
        </div>
        <div className="Row" >      
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Direccion"
            variant="outlined"
            value={datosCliente.direccion}
            onChange={(e) => setDatoCliente('direccion', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Telefono"
            variant="outlined"
            value={datosCliente.telefono}
            onChange={(e) => setDatoCliente('telefono', e.target.value)}
          />
        </div>
        <div className="Row"> 
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="E-Mail"
            variant="outlined"
            value={datosCliente.email}
            onChange={(e) => setDatoCliente('email', e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className='Dato'
            label="Instagram"
            variant="outlined"
            value={datosCliente.instagram}
            onChange={(e) => setDatoCliente('instagram', e.target.value)}
          />
        </div>
        <div className="Linea" style={{display:'flex', placeContent:'center'}}>
          <Button variant="contained" className='Boton' onClick={() => { salir(); guardarCliente(datosCliente); }}>Guardar Nuevo Cliente</Button>
        </div>
        </div>
        </BaseModal>
    )
}