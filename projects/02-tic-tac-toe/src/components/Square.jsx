export const Square = ({children, isSelected, updateBoard, index}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  
  // Actualizar el tablero cuando se hace click
  const handleClick = () => {
    updateBoard(index)
  }
  
  // Retornar el componente Square con el tablero actualizado cuando se hace click 
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}