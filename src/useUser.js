import {useState, useEffect} from "react";

export default function useUser(){

  const [datos, setDatos] = useState(null);
  const [token, setToken] = useState(null);
  const [logged, setLogged] = useState(false);

  const setDato = (campo, valor) => {
    const campos = { 
      datos:(v) => setDatos(v),
      token:(v) => setToken(v),
      logged:(v) => setLogged(v)
    }
    return campos[campo](valor);
  }

  return [datos, token, logged, setDato]

}