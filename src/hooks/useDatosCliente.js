import { useState } from "react";

export function useDatosCliente (){
  
  const [id, setId] = useState(-1);
  const [documento, setDocumento] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nombres, setNombres] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const setDatoCliente = (tipo, valor) => {
    switch (tipo) {
      case 'id': return (setId(valor));
      case 'documento': return (setDocumento(valor));
      case 'apellidos': return (setApellidos(valor));
      case 'nombres': return (setNombres(valor));
      case 'fechaNac': return (setFechaNac(valor));
      case 'direccion': return (setDireccion(valor));
      case 'telefono': return (setTelefono(valor));
      case 'email': return (setEmail(valor));
      case 'instagram': return (setInstagram(valor));
      default: return ("Error")
    }
  }

  return ([{ id, documento, apellidos, nombres, fechaNac, 
    direccion, telefono,email, instagram
  }, setDatoCliente]);
}