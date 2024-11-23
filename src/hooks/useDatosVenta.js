import { useState } from "react";

export function useDatosVenta (){
  
  const [id, setId] = useState();
  const [numFactura, setNumFactura] = useState("");
  const [fechaVenta, setFechaVenta] = useState("");
  const [cliente, setCliente] = useState({});
  const [tipoPago, setTipoPago] = useState("");
  const [observacion, setObservacion] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [facturada, setFacturada] = useState(false);
  const [detallesVenta, setdetallesVenta] = useState([]);

  const setDatoVenta = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'numFactura': return (setNumFactura(valor));
      case 'fechaVenta': return (setFechaVenta(valor));
      case 'cliente': return (setCliente(valor));
      case 'tipoPago': return (setTipoPago(valor));
      case 'observacion': return (setObservacion(valor));
      case 'valorFinal': return (setValorFinal(valor));
      case 'facturada': return (setFacturada(valor));
      case 'detallesVenta': return (setdetallesVenta(valor));
      default: return ("Error")
    }
  }

  return ([{ id, numFactura, fechaVenta, tipoPago, 
    valorFinal, facturada, observacion,
    detallesVenta, cliente
  }, setDatoVenta]);
}