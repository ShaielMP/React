import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const turns = {
  X: 'x',
  O: 'o',
}

const Square = ({children, isSelected, updateBoard, index}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  
  const handleClick = () => {
    updateBoard(index)
  }
  
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const winner_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function App() {
  const [board, setBoard] = useState(
    Array(9).fill(null)
  )

  const [turn, setTurn] = useState(turns.X)
  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null) 

  const checkWinner = (boardToCheck) => {
    for (const combo of winner_combos) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] && // Si hay un valor
        boardToCheck[a] === boardToCheck[b] && // Si los valores son iguales
        boardToCheck[a] === boardToCheck[c] 
      ) {
        return boardToCheck[a] // Retornar el ganador
      }
    }
    // No hay ganador
    return null
  }

  const updateBoard = (index) => {
    // No se actualiza la posición si ya hay un valor
    if (board[index] || winner) return
    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // Cambiar el turno
    const newTurn = turn === turns.X ? turns.O : turns.X
    setTurn(newTurn)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
    }
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <section className='game'>
        {
          board.map((_, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === turns.X}>
          {turns.X}
        </Square>
        <Square isSelected={turn === turns.O}>
          {turns.O}
        </Square>
      </section>

      {
        winner !== null && (
          <section className='winner'>
            <div className='text'>
              <h2>
                {
                  winner === false
                   ? 'Empate' 
                   : 'Ganó:'
                }
              </h2>
              <header className='win'>
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button>Empezar de nuevo</button>
              </footer>
            </div>
          </section>

        )
      }
    </main>
  )
}

export default App
