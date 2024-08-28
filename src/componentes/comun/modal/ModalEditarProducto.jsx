import BaseModal from "./BaseModal";
import { 
    Button,
    TextField,
    Autocomplete
  } from '@mui/material';
import { useDatosProducto } from '../../../hooks/useDatosProducto';

export default function ModalGenerado ({guardarProducto, proveedoresLista, tiposProductoLista,
  marcasLista, salir, titulo, datos}){

    const [datosProducto, setDatoProducto] = useDatosProducto(null);

    return (
        <BaseModal titulo={titulo} salir={()=>salir()}>
        <div className='Formulario'style={{display:'flex', flex:1, padding:5, placeItems:'center'}}>
          <div className="Row">
            <Autocomplete
              value={datos.proveedor}
              onChange={(e,n) => {datos.proveedor = n}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={proveedoresLista}
              getOptionLabel={(option) => option.proveedor}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Proveedor"/>}
            />
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Codigo Proveedor"
              variant="outlined"
              value={datos.codigoProveedor}
              onChange={(e) => datos.codigoProveedor = e.target.value}
            />
          </div>
          <div className="Row">
            <TextField
              style={{ flex: 3, margin: 10 }}
              className="Dato"
              label="Producto"
              variant="outlined"
              value={datos.producto}
              onChange={(e) => datos.producto = e.target.value}
            />
            <Autocomplete
              value={datos.tiposProducto}
              onChange={(e,n) => {datos.tiposProducto = n}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={tiposProductoLista}
              getOptionLabel={(option) => option.tipoProducto}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 2, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Tipo Producto"/>}
              multiple={true}
            />
          </div>
          <div className="Row" >  
            <Autocomplete
              value={datos.marca}
              onChange={(e,n) => {console.log(datos.marca);datos.marca = n}}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={marcasLista}
              getOptionLabel={(option) => option.marca}
              noOptionsText="Sin resultados"
              size="medium"
              style={{flex: 3, maxWidth:350, margin: '4px 4px', paddingLeft: 5, alignContent:'center'}}
              renderInput={(params) => <TextField {...params} label="Marca"/>}
            />    
            <TextField
              style={{ flex: 2, margin: 10 }}
              className='Dato'
              label="Stock"
              variant="outlined"
              value={datos.stock}
              onChange={(e) => datos.stock = e.target.value}
            />
            <TextField
              style={{ flex: 2, margin: 10 }}
              className='Dato'
              label="Precio Lista"
              variant="outlined"
              value={datos.precioLista}
              onChange={(e) => datos.precioLista = e.target.value}
            />
          </div>
          <div className="Row"> 
            <TextField
              style={{ flex: 1, margin: 10 }}
              className='Dato'
              label="Observacion"
              variant="outlined"
              value={datos.observacion}
              onChange={(e) => datos.observacion = e.target.value}
            />
          </div>        
          <div className='Botonera'>
            <Button variant="contained" className='Boton' onClick={() => { salir(); guardarProducto(datos, true) }}>Guardar Producto</Button>
          </div> 
        </div>
        </BaseModal>
    )
}