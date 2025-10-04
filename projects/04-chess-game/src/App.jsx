import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const pieces = {
    white: {
      king: { symbol: "♔", color: "white", type: "king" },
      queen: { symbol: "♕", color: "white", type: "queen" },
      rook: { symbol: "♖", color: "white", type: "rook" },
      bishop: { symbol: "♗", color: "white", type: "bishop" },
      knight: { symbol: "♘", color: "white", type: "knight" },
      pawn: { symbol: "♙", color: "white", type: "pawn" },
    },
    black: {
      king: { symbol: "♚", color: "black", type: "king" },
      queen: { symbol: "♛", color: "black", type: "queen" },
      rook: { symbol: "♜", color: "black", type: "rook" },
      bishop: { symbol: "♝", color: "black", type: "bishop" },
      knight: { symbol: "♞", color: "black", type: "knight" },
      pawn: { symbol: "♟", color: "black", type: "pawn" },
    },
  };

  // Crea el estado del tablero, inicialmente vacio
  const [board, setBoard] = useState(() => {
    const newBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Colocar las piezas negras
    newBoard[0][0] = pieces.black.rook;
    newBoard[0][1] = pieces.black.knight;
    newBoard[0][2] = pieces.black.bishop;
    newBoard[0][3] = pieces.black.queen;
    newBoard[0][4] = pieces.black.king;
    newBoard[0][5] = pieces.black.bishop;
    newBoard[0][6] = pieces.black.knight;
    newBoard[0][7] = pieces.black.rook;

    // Colocar peones negros
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = pieces.black.pawn;
    }

    // Colocar peones blancos
    for (let col = 0; col < 8; col++) {
      newBoard[6][col] = pieces.white.pawn;
    }

    // Colocar las piezas blancas
    newBoard[7][0] = pieces.white.rook;
    newBoard[7][1] = pieces.white.knight;
    newBoard[7][2] = pieces.white.bishop;
    newBoard[7][3] = pieces.white.queen;
    newBoard[7][4] = pieces.white.king;
    newBoard[7][5] = pieces.white.bishop;
    newBoard[7][6] = pieces.white.knight;
    newBoard[7][7] = pieces.white.rook;

    return newBoard;
  });

  const [turn, setTurn] = useState("white");
  const [selectedSquare, setSelectedSquare] = useState(null);

  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);

  const [check, setCheck] = useState({ white: false, black: false });

  const [gameStatus, setGameStatus] = useState("normal");
  const [winner, setWinner] = useState(null);

  // Verificar jaque después de cada cambio en el tablero
  useEffect(() => {
    const whiteInCheck = isInCheck("white");
    const blackInCheck = isInCheck("black");

    setCheck({ white: whiteInCheck, black: blackInCheck });

    const currentPlayerStatus = getGameStatus(turn);
    setGameStatus(currentPlayerStatus);

    if (currentPlayerStatus === "checkmate") {
      const winnerColor = turn === "white" ? "black" : "white";
      setWinner(winnerColor);
      console.log(`Jaque mate! El ganador es: ${winnerColor}`);
    } else if (currentPlayerStatus === "stalemate") {
      setWinner("draw");
      console.log("Tablas por ahogado");
    } else if (whiteInCheck) {
      console.log("Las blancas estan en jaque");
    } else if (blackInCheck) {
      console.log("Las negras estan en jaque");
    }
  }, [board, turn]);

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    //Crear una copia del tablero
    const newBoard = board.map((row) => [...row]);

    //Obtener la pieza que se va a mover
    const piece = newBoard[fromRow][fromCol];

    // Pieza que será capturada
    const capturedPiece = newBoard[toRow][toCol];

    if (capturedPiece) {
      console.log(`Capturada! ${capturedPiece.color} ${capturedPiece.type}`);
      if (capturedPiece.color === "white") {
        setCapturedWhite([...capturedWhite, capturedPiece]);
      } else {
        setCapturedBlack([...capturedBlack, capturedPiece]);
      }
    }

    //Mover la pieza
    newBoard[toRow][toCol] = piece; // Colocar en destino
    newBoard[fromRow][fromCol] = null; // Quitar del origen

    // Actualizar el tablero
    setBoard(newBoard);

    // Cambiar turno
    const nextTurn = turn === "white" ? "black" : "white";
    setTurn(nextTurn);

    console.log(`Pieza movida! Ahora es turno de: ${nextTurn}`);
  };

  // Funcion para manejar el clic en una casilla
  const handleSquareClick = (row, col) => {
    const clickedPiece = board[row][col];

    if (!selectedSquare) {
      // Verificar que hay pieza Y que es del jugador actual
      if (clickedPiece && clickedPiece.color === turn) {
        console.log(
          `Seleccionando pieza ${clickedPiece.type} ${clickedPiece.color}`
        );
        setSelectedSquare({ row, col });
      } else if (clickedPiece && clickedPiece.color !== turn) {
        console.log(
          `No puedes mover piezas de color ${clickedPiece.color}, es turno de ${turn}`
        );
      }
    } else {
      // Ya hay algo seleccionado, intentar mover
      const fromRow = selectedSquare.row;
      const fromCol = selectedSquare.col;

      // Si hace click en la misma casilla, deseleccionar
      if (fromRow === row && fromCol === col) {
        console.log(`Deseleccionando pieza`);
        setSelectedSquare(null);
        return;
      }

      // Verificar que no intenta capturar pieza propia
      if (clickedPiece && clickedPiece.color === turn) {
        console.log("Cambiando selección a otra pieza propia");
        setSelectedSquare({ row, col });
        return;
      }

      // Mover la pieza
      if (isValidMove(fromRow, fromCol, row, col)) {
        console.log(
          `Movimiento válido: ${fromRow}, ${fromCol} a ${row}, ${col}`
        );
        movePiece(fromRow, fromCol, row, col);
        setSelectedSquare(null);
      } else {
        console.log(`Movimiento inválido para ${board[fromRow][fromCol].type}`);
      }
    }
  };

  // Crea una casilla con coordenadas
  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    let squareClass = isLight ? "square light" : "square dark";

    if (
      selectedSquare &&
      selectedSquare.row === row &&
      selectedSquare.col === col
    ) {
      squareClass += " selected";
    }

    const piece = board[row][col]; // Obtiene la pieza en la casilla

    return (
      // key es un identificador unico para cada cuadrado del tablero
      <div
        key={`${row}-${col}`}
        className={squareClass}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece ? piece.symbol : ""}
      </div>
    );
  };

  // Funcion para crear el tablero
  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col));
      }
    }
    return squares;
  };

  const resetGame = () => {
    console.log("Reiniciando juego...");

    const newBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Colocar las piezas negras
    newBoard[0][0] = pieces.black.rook;
    newBoard[0][1] = pieces.black.knight;
    newBoard[0][2] = pieces.black.bishop;
    newBoard[0][3] = pieces.black.queen;
    newBoard[0][4] = pieces.black.king;
    newBoard[0][5] = pieces.black.bishop;
    newBoard[0][6] = pieces.black.knight;
    newBoard[0][7] = pieces.black.rook;

    // Colocar peones negros
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = pieces.black.pawn;
    }

    // Colocar peones blancos
    for (let col = 0; col < 8; col++) {
      newBoard[6][col] = pieces.white.pawn;
    }

    // Colocar las piezas blancas
    newBoard[7][0] = pieces.white.rook;
    newBoard[7][1] = pieces.white.knight;
    newBoard[7][2] = pieces.white.bishop;
    newBoard[7][3] = pieces.white.queen;
    newBoard[7][4] = pieces.white.king;
    newBoard[7][5] = pieces.white.bishop;
    newBoard[7][6] = pieces.white.knight;
    newBoard[7][7] = pieces.white.rook;

    setBoard(newBoard);
    setTurn("white");
    setSelectedSquare(null);
    setCapturedBlack([]);
    setCapturedWhite([]);
  };

  // Función para verificar si una casilla está dentro del tablero
  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  // Función para verificar si el camino está libre (para torres, alfiles, reina)
  const isPathClear = (fromRow, fromCol, toRow, toCol) => {
    // Calcular la diferencia de filas y columnas
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Calcular la dirección del movimiento
    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    // Verificar cada casilla en el camino (sin incluir origen y destino)
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol] !== null) {
        return false; // Hay una pieza bloqueando el camino
      }

      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  // Función para verificar si el movimiento de un peon es valido
  const isValidPawnMove = (fromRow, fromCol, toRow, toCol, color) => {
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    const targetPiece = board[toRow][toCol];

    // Dirección del peón (blancas suben, negras bajan)
    const direction = color === "white" ? -1 : 1;

    // Movimiento hacia adelante
    if (colDiff === 0) {
      // No puede capturar hacia adelante
      if (targetPiece) return false;

      // Un paso hacia adelante
      if (rowDiff === direction) return true;

      // Dos pasos desde posición inicial
      const startRow = color === "white" ? 6 : 1;
      if (fromRow === startRow && rowDiff === direction * 2) return true;

      return false;
    }

    // Captura en diagonal
    if (colDiff === 1 && rowDiff === direction) {
      // Solo puede capturar si hay pieza enemiga
      return targetPiece && targetPiece.color !== color;
    }

    return false;
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Verificar posición válida
    if (!isValidPosition(toRow, toCol)) {
      return false;
    }

    // No se puede capturar pieza propia
    if (targetPiece && targetPiece.color === piece.color) {
      return false;
    }

    // Calcular diferencias de posición
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    console.log(
      `Validando movimiento de ${piece.type}: ${fromRow}, ${fromCol} -> ${toRow}, ${toCol}`
    );

    // Verificar reglas de la pieza
    let moveFollowsRules = false;

    switch (piece.type) {
      case "pawn":
        moveFollowsRules = isValidPawnMove(
          fromRow,
          fromCol,
          toRow,
          toCol,
          piece.color
        );
        break;
      case "rook":
        if (rowDiff === 0 || colDiff === 0) {
          moveFollowsRules = isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;
      case "bishop":
        if (rowDiff === colDiff) {
          moveFollowsRules = isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;
      case "queen":
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
          moveFollowsRules = isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;
      case "king":
        moveFollowsRules = rowDiff <= 1 && colDiff <= 1;
        break;
      case "knight":
        moveFollowsRules =
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        break;
      default:
        return false;
    }

    if (!moveFollowsRules) {
      console.log(`Movimiento no sigue las reglas de la pieza: ${piece.type}`);
      return false;
    }

    if (wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol)) {
      console.log(`Movimiento rechazado por dejar al rey en check`);
      return false;
    }

    return true;
  };

  // Función para encontrar el rey de un jugador
  const findKing = (color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "king" && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isSquareUnderAttack = (row, col, attackingColor) => {
    // Revisar todas las casillas del tablero
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];

        if (piece && piece.color === attackingColor) {
          if (canPieceAttackSquare(fromRow, fromCol, row, col, piece)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const canPieceAttackSquare = (fromRow, fromCol, toRow, toCol, piece) => {
    if (!isValidPosition(toRow, toCol)) {
      return false;
    }

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece.type) {
      case "pawn": {
        const direction = piece.color === "white" ? -1 : 1;
        const actualRowDiff = toRow - fromRow;

        return colDiff === 1 && actualRowDiff === direction;
      }

      case "rook":
        if (rowDiff === 0 || colDiff === 0) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }

        return false;

      case "bishop":
        if (rowDiff === colDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }

        return false;

      case "queen":
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }

        return false;

      case "king":
        return rowDiff <= 1 && colDiff <= 1;

      case "knight":
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );

      default:
        return false;
    }
  };

  const isInCheck = (color) => {
    const kingPosition = findKing(color);
    if (!kingPosition) return false;

    return isSquareUnderAttack(
      kingPosition.row,
      kingPosition.col,
      color === "white" ? "black" : "white"
    );
  };

  const simulateMove = (fromRow, fromCol, toRow, toCol, currentBoard) => {
    // Crear una copia del tablero
    const simulatedBoard = currentBoard.map((row) => [...row]);

    // Realizar el movimiento simulado
    const piece = simulatedBoard[fromRow][fromCol];
    simulatedBoard[fromRow][fromCol] = null;
    simulatedBoard[toRow][toCol] = piece;

    return simulatedBoard;
  };

  // Función para verificar si una casilla está siendo atacada por una pieza
  const isSquareUnderAttackInBoard = (row, col, attackingColor, testBoard) => {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = testBoard[fromRow][fromCol];

        if (piece && piece.color === attackingColor) {
          if (
            canPieceAttackSquareInBoard(
              fromRow,
              fromCol,
              row,
              col,
              piece,
              testBoard
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const canPieceAttackSquareInBoard = (
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece,
    testBoard
  ) => {
    if (!isValidPosition(toRow, toCol)) {
      return false;
    }

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece.type) {
      case "pawn": {
        const direction = piece.color === "white" ? -1 : 1;
        const actualRowDiff = toRow - fromRow;

        return colDiff === 1 && actualRowDiff === direction;
      }

      case "rook":
        if (rowDiff === 0 || colDiff === 0) {
          return isPathClearInBoard(fromRow, fromCol, toRow, toCol, testBoard);
        }

        return false;

      case "bishop":
        if (rowDiff === colDiff) {
          return isPathClearInBoard(fromRow, fromCol, toRow, toCol, testBoard);
        }

        return false;

      case "queen":
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
          return isPathClearInBoard(fromRow, fromCol, toRow, toCol, testBoard);
        }

        return false;

      case "king":
        return rowDiff <= 1 && colDiff <= 1;

      case "knight":
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );

      default:
        return false;
    }
  };

  const isPathClearInBoard = (fromRow, fromCol, toRow, toCol, testBoard) => {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (testBoard[currentRow][currentCol] !== null) {
        return false;
      }

      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  const findKingInBoard = (color, testBoard) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = testBoard[row][col];
        if (piece && piece.type === "king" && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  // Función para verificar si un movimiento dejaría al rey en jaque
  const wouldLeaveKingInCheck = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];

    if (!piece) return true;

    const simulatedBoard = simulateMove(fromRow, fromCol, toRow, toCol, board);
    const kingPosition = findKingInBoard(piece.color, simulatedBoard);

    if (!kingPosition) return true;

    const enemyColor = piece.color === "white" ? "black" : "white";
    return isSquareUnderAttackInBoard(
      kingPosition.row,
      kingPosition.col,
      enemyColor,
      simulatedBoard
    );
  };

  const getAllValidMoves = (color) => {
    const validMoves = [];

    // Revisar todas las casillas del tablero
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];

        // Si hay una pieza del color especificado
        if (piece && piece.color === color) {
          // Probar todos los movimientos posibles
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                validMoves.push({
                  from: { row: fromRow, col: fromCol },
                  to: { row: toRow, col: toCol },
                  piece: piece.type,
                });
              }
            }
          }
        }
      }
    }

    return validMoves;
  };

  const getGameStatus = (color) => {
    const isCurrentInCheck = isInCheck(color);
    const validMoves = getAllValidMoves(color);

    console.log(`Analizando situación para ${color}:`);
    console.log(`En jaque: ${isCurrentInCheck}`);
    console.log(`Movimientos validos: ${validMoves.length}`);

    if (validMoves.length === 0) {
      if (isCurrentInCheck) {
        return "checkmate";
      } else {
        return "stalemate";
      }
    }

    if (isCurrentInCheck) {
      return "check";
    }

    return "normal";
  };

  return (
    <div>
      <h1>Chess Game</h1>
      {gameStatus === "checkmate" && (
        <div className="game-over checkmate">
          <h2>¡¡¡JAQUE MATE!!!</h2>
          <p>Ganaron las {winner === "white" ? "BLANCAS ♔" : "NEGRAS ♚"}</p>
        </div>
      )}

      {gameStatus === "stalemate" && (
        <div className="game-over stalemate">
          <h2>¡¡¡TABLAS!!!</h2>
          <p>Empate por ahogado</p>
        </div>
      )}

      {gameStatus !== "checkmate" && gameStatus !== "stalemate" && (
        <div className="turn-info">
          <p>
            Turno:{" "}
            <span className={turn === "white" ? "white-turn" : "black-turn"}>
              {turn === "white" ? "Blancas ♔" : "Negras ♚"}
              {check[turn] && " ¡EN JAQUE! ⚠️"}
            </span>
          </p>
        </div>
      )}
      <div className="board">{renderBoard()}</div>
      <div className="captured-pieces">
        <div className="captured-white">
          <h3>Piezas blancas capturadas:</h3>
          <div className="captured-list">
            {capturedWhite.map((piece, index) => (
              <span key={index} className="captured-piece">
                {piece.symbol}
              </span>
            ))}
          </div>
        </div>
        <div className="captured-black">
          <h3>Piezas negras capturadas:</h3>
          <div className="captured-list">
            {capturedBlack.map((piece, index) => (
              <span key={index} className="captured-piece">
                {piece.symbol}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={resetGame} className="reset-button">
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default App;
