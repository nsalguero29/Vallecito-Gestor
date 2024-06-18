import './styles.css';

export default function Boton({onClick, disabled, color, children}){

  return(
    <span 
      className="Boton"
      style={{
        backgroundColor: color ? color : null,
        color: disabled ? 'grey' : null,
        cursor: disabled && 'not-allowed'
      }}
      onClick={() => !disabled && onClick()}
    >
      {children}
    </span>
  )
}