import React from 'react';
import  './css/Accion.css';
import './styles.css';
//{icono==='keyboard_arrow_up'?"▲":"▼"}
export default function Accion({fontSize, backgroundColor, disabled, icono, ayuda, onClick}){

  return(
    <span
      className="material-icons Accion"
      style={{
        fontSize,
        backgroundColor,
        color: disabled ? "grey" : "black",
        cursor: disabled ? "not-allowed" : "pointer",
        display:'flex', justifyContent:'center', alignItems:'center'
      }}
      onClick={() => !disabled && onClick()}
      title={ayuda}
    >{icono}</span>
  )

}
