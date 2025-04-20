import { useState } from "react";

export function useDatosProveedor (){
  
  const [id, setId] = useState(-1);
  const [proveedor, setProveedor] = useState("");
  const [nombreContacto, setnombreContacto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const setDatoProveedor = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'proveedor': return (setProveedor(valor));
      case 'nombreContacto': return (setnombreContacto(valor));
      case 'direccion': return (setDireccion(valor));
      case 'telefono': return (setTelefono(valor));
      case 'sitioWeb': return (setSitioWeb(valor));
      case 'email': return (setEmail(valor));
      case 'instagram': return (setInstagram(valor));
      default: return ("Error")
    }
  }

  return ([{id, proveedor, nombreContacto, 
    direccion, telefono, sitioWeb, email, instagram
  }, setDatoProveedor]);
}