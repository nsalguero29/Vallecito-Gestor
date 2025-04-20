import { useState } from "react";

export function useDatosProducto (){
  
  const [id, setId] = useState(-1);
  const [producto, setProducto] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [stock, setStock] = useState(0);
  const [precioLista, setPrecioLista] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [proveedor, setProveedor] = useState(null);
  const [marca, setMarca] = useState(null);
  const [tiposProducto, setTiposProducto] = useState([]);  

  const setDatoProducto = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'producto': return (setProducto(valor));
      case 'codigo': return (setCodigo(valor));
      case 'codigoProveedor': return (setCodigoProveedor(valor));
      case 'stock': return (setStock(valor));
      case 'precioLista': return (setPrecioLista(valor));
      case 'observacion': return (setObservacion(valor));
      case 'proveedor': return (setProveedor(valor));
      case 'marca': return (setMarca(valor));
      case 'tiposProducto': return (setTiposProducto(valor));
      default: return ("Error")
    }
  }

  return ([{ id, producto, codigo, codigoProveedor, 
    stock, precioLista, observacion,
    proveedor, marca, tiposProducto
  }, setDatoProducto]);
}