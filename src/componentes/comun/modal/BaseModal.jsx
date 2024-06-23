import "./styles.css";

export default function BaseModal({ children, titulo, salir, loading }) {
  return (
    <div className="ModalContenedor" onClick={() => !loading && salir()}>
      <div 
        className="Contenido" 
        onClick={(e) => e.stopPropagation()} 
        style={loading && {paddingTop:'150px', paddingBottom:'130px'}}
      >
        <div className="Titulo">          
          <b><h3 style={{ padding: '0 55px' }}>{titulo}</h3></b>
          {!loading &&
            <span className="Salir" onClick={() => salir()}>X</span>
          }
        </div>
        {!loading &&
          <>
            <hr width="100%" />
            <div className="Cuerpo">
              {children}
            </div>
          </>
        }
      </div>
    </div>
  )
}