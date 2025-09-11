import { winner_combos } from "../constants.js"

export const checkWinner = (boardToCheck) => {
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

export const checkEndGame = (boardToCheck) => {
    /** Revisamos si hay un empate,
     * si no hay más espacios vacíos
     * en el tablero
     */
    return boardToCheck.every((square) => square !== null)
  }
