import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import confetti from 'canvas-confetti'
import './App.css'
import { Square } from './components/Square'
import { turns, winner_combos } from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal'
import { Board } from './components/Board'

function App() {
  // Tablero 
  const [board, setBoard] = useState(
    Array(9).fill(null)
  )

  const [turn, setTurn] = useState(turns.X)
  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null) 

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(turns.X)
    setWinner(null)
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
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // Empate
    }
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <Board board={board} updateBoard={updateBoard}/>
      <section className='turn'>
        <Square isSelected={turn === turns.X}>
          {turns.X}
        </Square>
        <Square isSelected={turn === turns.O}>
          {turns.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
