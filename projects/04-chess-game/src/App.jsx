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

  const [capturedWhite, setCapturedWhite] = useState([])
  const [capturedBlack, setCapturedBlack] = useState([])

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    //Crear una copia del tablero
    const newBoard = board.map(row => [...row])

    //Obtener la pieza que se va a mover
    const piece = newBoard[fromRow][fromCol]

    // Pieza que será capturada
    const capturedPiece = newBoard[toRow][toCol]

    if (capturedPiece) {
      console.log(`Capturada! ${capturedPiece.color} ${capturedPiece.type}`)
      if (capturedPiece.color === 'white') {
        setCapturedWhite([...capturedWhite, capturedPiece])
      } else {
        setCapturedBlack([...capturedBlack, capturedPiece])
      }
    }
    
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
      if (isValidMove(fromRow, fromCol, row, col)) {
        console.log(`Movimiento válido: ${fromRow}, ${fromCol} a ${row}, ${col}`)
        movePiece(fromRow, fromCol, row, col)
        setSelectedSquare(null)
      } else {
        console.log(`Movimiento inválido para ${board[fromRow][fromCol].type}`)
      }
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

  const resetGame = () => {
    console.log('Reiniciando juego...')

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

    setBoard(newBoard)
    setTurn('white')
    setSelectedSquare(null)
    setCapturedBlack([])
    setCapturedWhite([])
  }

  // Función para verificar si una casilla está dentro del tablero
  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  // Función para verificar si el camino está libre (para torres, alfiles, reina)
  const isPathClear =(fromRow, fromCol, toRow, toCol) => {
    // Calcular la diferencia de filas y columnas
    const rowDiff = toRow - fromRow
    const colDiff = toCol - fromCol

    // Calcular la dirección del movimiento
    const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1)
    const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1)

    // Verificar cada casilla en el camino (sin incluir origen y destino)
    let currentRow = fromRow + rowStep
    let currentCol = fromCol + colStep

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) {
        return false // Hay una pieza bloqueando el camino
      }

      currentRow += rowStep
      currentCol += colStep
    }

    return true
  }

  // Función para verificar si el movimiento de un peon es valido
  const isValidPawnMove = (fromRow, fromCol, toRow, toCol, color) => {
  const rowDiff = toRow - fromRow
  const colDiff = Math.abs(toCol - fromCol)
  const targetPiece = board[toRow][toCol]
  
  // Dirección del peón (blancas suben, negras bajan)
  const direction = color === 'white' ? -1 : 1
  
  // Movimiento hacia adelante
  if (colDiff === 0) {
    // No puede capturar hacia adelante
    if (targetPiece) return false
    
    // Un paso hacia adelante
    if (rowDiff === direction) return true
    
    // Dos pasos desde posición inicial
    const startRow = color === 'white' ? 6 : 1
    if (fromRow === startRow && rowDiff === direction * 2) return true
    
    return false
  }
  
  // Captura en diagonal
  if (colDiff === 1 && rowDiff === direction) {
    // Solo puede capturar si hay pieza enemiga
    return targetPiece && targetPiece.color !== color
  }
  
  return false
}

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol]
    const targetPiece = board[toRow][toCol]

    // Verificar posición válida
    if (!isValidPosition(toRow, toCol)) {
      return false
    }

    // No se puede capturar pieza propia
    if (targetPiece && targetPiece.color === piece.color) {
      return false
    }

    // Calcular diferencias de posición
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    console.log(`Validando movimiento de ${piece.type}: ${fromRow}, ${fromCol} -> ${toRow}, ${toCol}`)
  
    switch (piece.type) {
      case 'pawn':
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color)

      case 'rook':
        // Torre se mueve en línea recta (horizontal o vertical)
        if (rowDiff === 0 || colDiff === 0) {
          return isPathClear(fromRow, fromCol, toRow, toCol)
        }

        return false

      case 'bishop':
        // Alfil se mueve en diagonal
        if (rowDiff === colDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol)
        }

        return false

      case 'queen':
        // Reina se mueve en cualquier dirección
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol)
        }

        return false

      case 'king':
        // Rey se mueve una casilla en cualquier dirección
        return rowDiff <= 1 && colDiff <= 1

      case 'knight':
        // Caballo se mueve en L (2+1 o 1+2)
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      default:
        return false
    }
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
      <div className='captured-pieces'>
        <div className='captured-white'>
          <h3>Piezas blancas capturadas:</h3>
          <div className='captured-list'>
            {capturedWhite.map((piece, index) => (
              <span key={index} className='captured-piece'>{piece.symbol}</span>
            ))}
          </div>
        </div>
        <div className='captured-black'>
          <h3>Piezas negras capturadas:</h3>
          <div className='captured-list'>
            {capturedBlack.map((piece, index) => (
              <span key={index} className='captured-piece'>{piece.symbol}</span>
            ))}
          </div>
        </div>
      </div>
      <div className='controls'>
        <button onClick={resetGame} className='reset-button'>
          Reiniciar
        </button>
      </div>
    </div>
  )
}

export default App
