import { useState } from "react";

export function useDatosBicicleta (){
  
  const [cuadro, setCuadro] = useState("");
  const [color, setColor] = useState("");
  const [marcaId, setMarcaId] = useState();
  const [modeloId, setModeloId] = useState();
  const [observacion, setObservacion] = useState("");

  const setDatoBicicleta = (tipo, valor) => {
    switch (tipo) {
      case 'cuadro': return (setCuadro(valor));
      case 'color': return (setColor(valor));      
      case 'marcaId': return (setMarcaId(valor));
      case 'modeloId': return (setModeloId(valor));      
      case 'observacion': return (setObservacion(valor));
      default: return ("Error")
    }
  }

  return ([{ cuadro, color, 
    observacion,
    modeloId, marcaId
  }, setDatoBicicleta]);
}