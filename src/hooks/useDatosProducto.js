import { useState } from "react";

export function useDatosProducto (){
  
  const [producto, setProducto] = useState("");
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [stock, setStock] = useState();
  const [precioLista, setPrecioLista] = useState("");
  const [observacion, setObservacion] = useState("");
  const [proveedorId, setProveedorId] = useState();
  const [marcaId, setMarcaId] = useState();

  const setDatoProducto = (tipo, valor) => {
    switch (tipo) {
      case 'producto': return (setProducto(valor));
      case 'codigoProveedor': return (setCodigoProveedor(valor));
      case 'stock': return (setStock(valor));
      case 'precioLista': return (setPrecioLista(valor));
      case 'observacion': return (setObservacion(valor));
      case 'proveedorId': return (setProveedorId(valor));
      case 'marcaId': return (setMarcaId(valor));
      default: return ("Error")
    }
  }

  return ([{ producto, codigoProveedor, 
    stock, precioLista, observacion,
    proveedorId, marcaId
  }, setDatoProducto]);
}