import { useState } from "react";

export function useDatosVenta (){
  
  const [id, setId] = useState();
  const [numFactura, setNumFactura] = useState("");
  const [fechaVenta, setFechaVenta] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [observacion, setObservacion] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [facturada, setFacturada] = useState(false);
  const [productos, setProductos] = useState([]);

  const setDatoVenta = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'numFactura': return (setNumFactura(valor));
      case 'fechaVenta': return (setFechaVenta(valor));
      case 'tipoPago': return (setTipoPago(valor));
      case 'observacion': return (setObservacion(valor));
      case 'valorFinal': return (setValorFinal(valor));
      case 'facturada': return (setFacturada(valor));
      case 'productos': return (setProductos(valor));
      default: return ("Error")
    }
  }

  return ([{ id, numFactura, fechaVenta, tipoPago, 
    valorFinal, facturada, observacion,
    productos
  }, setDatoVenta]);
}