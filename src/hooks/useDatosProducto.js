import { useState } from "react";

export function useDatosProducto (){
  
  const [id, setId] = useState();
  const [producto, setProducto] = useState("");
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [stock, setStock] = useState(0);
  const [precioLista, setPrecioLista] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [proveedorId, setProveedorId] = useState();
  const [marcaId, setMarcaId] = useState();
  const [tiposProductoId, setTiposProductoId] = useState([]);  

  const setDatoProducto = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'producto': return (setProducto(valor));
      case 'codigoProveedor': return (setCodigoProveedor(valor));
      case 'stock': return (setStock(valor));
      case 'precioLista': return (setPrecioLista(valor));
      case 'observacion': return (setObservacion(valor));
      case 'proveedorId': return (setProveedorId(valor));
      case 'marcaId': return (setMarcaId(valor));
      case 'tiposProductoId': return (setTiposProductoId(valor));
      default: return ("Error")
    }
  }

  return ([{ id, producto, codigoProveedor, 
    stock, precioLista, observacion,
    proveedorId, marcaId, tiposProductoId
  }, setDatoProducto]);
}