import { useState } from 'react'
import './App.css'

function App() {
  const pieces = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙',
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟',
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

  // Funcion para manejar el clic en una casilla
  const handleSquareClick = (row, col) => {
    const clickedPiece = board[row][col]

    if (!selectedSquare) {
      if (clickedPiece) {
        console.log(`Seleccionando pieza en la casilla (${row}, ${col})`, clickedPiece)
        setSelectedSquare({ row, col })
      }
    } else {
      console.log(`Ya hay una pieza seleccionada, intentando mover...`)
      setSelectedSquare(null)
    }
  }

  // Crea una casilla con coordenadas
  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0
    const squareClass = isLight ? 'square light' : 'square dark'
    const piece = board[row][col] // Obtiene la pieza en la casilla

    return (
      // key es un identificador unico para cada cuadrado del tablero
      <div 
        key={`${row}-${col}`} 
        className={squareClass}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece}
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
      <h3>Turn: {turn === 'white' ? 'White' : 'Black'}</h3>
      <div className="board">
        {renderBoard()}
      </div>
    </div>
  )
}

export default App
