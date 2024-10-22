import './styles.css';
import {
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';

export default function Paginador({page, limit, cargar,
  paginasTotales, opciones}){

  const handleChangePage = (newPage, newLimit = null) => {
    cargar(null, newPage, newLimit);
  };

  const handleChangeLimit = (event) => {
    const newLimit = event.target.value;
    handleChangePage(1, newLimit);
  };

  return(
    <div style={{display:'flex', width:'100%', placeItems:'center', flexDirection:'column'}}>
    <div>            
      <Pagination 
        count={paginasTotales} 
        shape="rounded" 
        page={page} 
        onChange={(e, nuevaPag)=> {handleChangePage(nuevaPag)}}
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
            <MenuItem key={op} value={op}>{op.toString()}</MenuItem>
          )
        })}
      </Select>
    </div>
  </div>
  )
}