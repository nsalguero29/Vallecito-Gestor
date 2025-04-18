import {useState, useEffect} from "react";


export default function useEnv(){
  const [ENV_LOADED, setEnvLoaded] = useState(false);
  const [BASE_URL, setBaseURL] = useState("");
  const [BASENAME, setBaseName] = useState("");

  useEffect(()=> {
    const env = import.meta.env;
    setTimeout(() => {
      if(env.DEV){
        setBaseURL(env.VITE_BASE_URL_DEV);
        setBaseName(env.VITE_BASENAME_DEV);
      }else{
        setBaseURL(env.VITE_BASE_URL);
        setBaseName(env.VITE_BASENAME);
      }
      setTimeout(() => setEnvLoaded(true), 100);
    },300)
  }, [])

  return {ENV_LOADED, BASE_URL, BASENAME}

}