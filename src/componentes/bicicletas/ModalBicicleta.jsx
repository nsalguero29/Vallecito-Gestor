import BaseModal from '../comun/modal/BaseModal';
import { 
    Button,
    TextField,
    Autocomplete
  } from '@mui/material';
import { useDatosBicicleta } from '../../hooks/useDatosBicicleta';

export default function ModalBicicleta ({guardarBicicleta, salir, 
  marcasLista, clientesLista, modelosLista, titulo}){

    const [datosBicicleta, setDatoBicicleta] = useDatosBicicleta(null);

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario' style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
        <div className="Row">
          <Autocomplete
            value={datosBicicleta.clienteId}
            onChange={(e,n) => {setDatoBicicleta('clienteId', n)}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={clientesLista}
            getOptionLabel={(option) => option.documento + " - " + option.apellidos + ", " + option.nombres}
            noOptionsText="Sin resultados"
            size="medium"
            style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
            renderInput={(params) => <TextField {...params} label="Cliente"/>}
          />
        </div>
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
            <Autocomplete
              value={datosBicicleta.modeloId}
              onChange={(e,n) => {setDatoBicicleta('modeloId', n)}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={modelosLista}
              getOptionLabel={(option) => option.modelo}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Modelo"/>}
            /> 
        </div>        
        <div className="Row">
          <div style={{flex:'flex', placeItems:'center', placeContent:'center'}}>
            <TextField
              style={{ flex: 1, margin: 10 }}
              className="Dato"
              label="Cuadro"
              variant="outlined"
              value={datosBicicleta.cuadro}
              onChange={(e) => setDatoBicicleta("cuadro", e.target.value)}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className="Dato"
              label="Color"
              variant="outlined"
              value={datosBicicleta.color}
              onChange={(e) => setDatoBicicleta("color", e.target.value)}
            />
          </div>
        </div>
        
        <div style={{flex:'flex', placeItems:'center', placeContent:'center'}}>
          <TextField
            style={{ flex: 1, margin: 10 }}
            className="Dato"
            label="Cuadro"
            variant="outlined"
            value={datosBicicleta.cuadro}
            onChange={(e) => setDatoBicicleta("cuadro", e.target.value)}
          />
          <TextField
            style={{ flex: 1, margin: 10 }}
            className="Dato"
            label="Color"
            variant="outlined"
            value={datosBicicleta.color}
            onChange={(e) => setDatoBicicleta("color", e.target.value)}
          />
          
        </div>

        <div className="Linea" style={{display:'flex', placeContent:'center'}}>
          <Button variant="contained" className='Boton' onClick={() => { salir(); guardarBicicleta(datosBicicleta); }}>Guardar Nueva Bicicleta</Button>
        </div>
        </div>
        </BaseModal>
    )
}