import {useState, useEffect} from "react";


export default function useEnv(){

  const [BASE_URL, setBaseURL] = useState("");
  const [BASENAME, setBaseName] = useState("");

  useEffect(()=> {
    const env = import.meta.env;
    if(env.DEV){
      setBaseURL(env.VITE_BASE_URL_DEV);
      setBaseName(env.VITE_BASENAME_DEV);
    }else{
      setBaseURL(env.VITE_BASE_URL);
      setBaseName(env.VITE_BASENAME);
    }
  }, [])

  return [BASE_URL, BASENAME]

}