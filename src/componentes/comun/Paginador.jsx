import './styles.css';
import {
	Button, TextField, InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';

export default function Paginador({page, limit , handleChangePage, 
  paginasTotales, handleChangeLimit, opciones}){

  return(
    <div style={{display:'flex', width:'100%', placeItems:'center', flexDirection:'column'}}>
    <div>            
      <Pagination 
        count={paginasTotales} 
        shape="rounded" 
        page={page} 
        onChange={(e, nuevaPag)=> handleChangePage(nuevaPag)}
        style={{marginTop:10}}
        />             
    </div>
    <div style={{display:'flex', flexDirection:'row', placeItems:'center'}}> 
    <InputLabel id="Reglabel" className="LabelPaginador" style={{textWrap: 'wrap',textAlign: 'center'}}>Registros por Pagina</InputLabel>
      <Select
        labelId="Reglabel"
        value={limit}
        onChange={(e)=>handleChangeLimit(e)}
      >
        {opciones.map((op)=>{
          return(
            <MenuItem value={op}>{op.toString()}</MenuItem>
          )
        })}
      </Select>
    </div>
  </div>
  )
}