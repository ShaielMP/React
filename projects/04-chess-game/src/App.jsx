import { useState } from 'react'
import './App.css'

function App() {
  const pieces = {
    white: {
      king: {symbol: '♔', color: 'white', type: 'king'},
      queen: {symbol: '♕', color: 'white', type: 'queen'},
      rook: {symbol: '♖', color: 'white', type: 'rook'},
      bishop: {symbol: '♗', color: 'white', type: 'bishop'},
      knight: {symbol: '♘', color: 'white', type: 'knight'},
      pawn: {symbol: '♙', color: 'white', type: 'pawn'},
    },
    black: {
      king: {symbol: '♚', color: 'black', type: 'king'},
      queen: {symbol: '♛', color: 'black', type: 'queen'},
      rook: {symbol: '♜', color: 'black', type: 'rook'},
      bishop: {symbol: '♝', color: 'black', type: 'bishop'},
      knight: {symbol: '♞', color: 'black', type: 'knight'},
      pawn: {symbol: '♟', color: 'black', type: 'pawn'},
    },
  }

  // Crea el estado del tablero, inicialmente vacio
  const [board, setBoard] = useState(() => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null))

    // Colocar las piezas negras
    newBoard[0][0] = pieces.black.rook
    newBoard[0][1] = pieces.black.knight
    newBoard[0][2] = pieces.black.bishop
    newBoard[0][3] = pieces.black.queen
    newBoard[0][4] = pieces.black.king
    newBoard[0][5] = pieces.black.bishop
    newBoard[0][6] = pieces.black.knight
    newBoard[0][7] = pieces.black.rook

    // Colocar peones negros
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = pieces.black.pawn
    }

    // Colocar peones blancos
    for (let col = 0; col < 8; col++) {
      newBoard[6][col] = pieces.white.pawn
    }

    // Colocar las piezas blancas
    newBoard[7][0] = pieces.white.rook
    newBoard[7][1] = pieces.white.knight
    newBoard[7][2] = pieces.white.bishop
    newBoard[7][3] = pieces.white.queen
    newBoard[7][4] = pieces.white.king
    newBoard[7][5] = pieces.white.bishop
    newBoard[7][6] = pieces.white.knight
    newBoard[7][7] = pieces.white.rook

    return newBoard
  })

  const [turn, setTurn] = useState('white')
  const [selectedSquare, setSelectedSquare] = useState(null)

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    //Crear una copia del tablero
    const newBoard = board.map(row => [...row])

    //Obtener la pieza que se va a mover
    const piece = newBoard[fromRow][fromCol]

    //Mover la pieza
    newBoard[toRow][toCol] = piece      // Colocar en destino
    newBoard[fromRow][fromCol] = null   // Quitar del origen

    // Actualizar el tablero
    setBoard(newBoard)

    // Cambiar turno
    setTurn(turn === 'white' ? 'black' : 'white')

    console.log(`Pieza movida! Ahora es turno de: ${turn === 'white' ? 'black' : 'white'}` )
  }

  // Funcion para manejar el clic en una casilla
  const handleSquareClick = (row, col) => {
    const clickedPiece = board[row][col]

    if (!selectedSquare) {
      // Verificar que hay pieza Y que es del jugador actual
      if (clickedPiece && clickedPiece.color === turn) {
        console.log(`Seleccionando pieza ${clickedPiece.type} ${clickedPiece.color}`)
        setSelectedSquare({ row, col })
      } else if (clickedPiece && clickedPiece.color !== turn) {
        console.log(`No puedes mover piezas de color ${clickedPiece.color}, es turno de ${turn}`)
      }
    } else {
      // Ya hay algo seleccionado, intentar mover
      const fromRow = selectedSquare.row
      const fromCol = selectedSquare.col

      // Si hace click en la misma casilla, deseleccionar
      if (fromRow === row && fromCol === col) {
        console.log(`Deseleccionando pieza`)
        setSelectedSquare(null)
        return
      }

      // Verificar que no intenta capturar pieza propia
      if (clickedPiece && clickedPiece.color === turn) {
        console.log('Cambiando selección a otra pieza propia')
        setSelectedSquare({ row, col })
        return
      }

      // Mover la pieza
      console.log(`Moviendo pieza de la casilla (${fromRow}, ${fromCol}) a la casilla (${row}, ${col})`)
      movePiece(fromRow, fromCol, row, col)
      setSelectedSquare(null)
    }
  }

  // Crea una casilla con coordenadas
  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0
    let squareClass = isLight ? 'square light' : 'square dark'
    
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      squareClass += ' selected'
    }
    
    const piece = board[row][col] // Obtiene la pieza en la casilla

    return (
      // key es un identificador unico para cada cuadrado del tablero
      <div 
        key={`${row}-${col}`} 
        className={squareClass}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece ? piece.symbol : ''}
      </div>
    )
  }

  // Funcion para crear el tablero
  const renderBoard = () => {
    const squares = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col))
      }
    }
    return squares
  }

  return (
    <div>
      <h1>Chess Game</h1>
      <div className='turn-info'>
        <p>Turno: <span className={turn === 'white' ? 'white-turn' : 'black-turn'}>
          {turn === 'white' ? 'Blancas ♔' : 'Negras ♚'}
          </span>
        </p>
      </div>
      <div className="board">
        {renderBoard()}
      </div>
    </div>
  )
}

export default App
