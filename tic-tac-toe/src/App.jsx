import { useState } from "react";

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState(null); // stores winning line indices

  function handleClick(index) {
    if (squares[index] || winningLine) return;

    const newSquares = [...squares];
    newSquares[index] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const winnerInfo = calculateWinner(newSquares);
    if (winnerInfo) {
      setWinningLine(winnerInfo.line); // save winning line
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal TL-BR
      [2, 4, 6], // diagonal TR-BL
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  }

  const winner = winningLine ? squares[winningLine[0]] : null;
  const status = winner ? `Winner: ${winner}` : `Next: ${xIsNext ? "X" : "O"}`;

  // line styles based on winning combination
  const getLineStyle = (line) => {
    if (!line) return {};
    const [a, , c] = line;

    // horizontal
    if (line[0] % 3 === 0 && line[1] % 3 === 1 && line[2] % 3 === 2) {
      return { top: `${Math.floor(a / 3) * 110 + 50}px`, left: "0px", width: "330px", height: "5px", transform: "none" };
    }
    // vertical
    if (line[0] < 3 && line[1] < 6 && line[2] < 9 && line[0] % 3 === line[1] % 3 && line[0] % 3 === line[2] % 3) {
      return { top: "0px", left: `${(line[0] % 3) * 110 + 50}px`, width: "5px", height: "330px", transform: "none" };
    }
    // diagonal TL-BR
    if (line[0] === 0 && line[1] === 4 && line[2] === 8) {
      return { top: "0px", left: "0px", width: "5px", height: "330px", transform: "rotate(45deg)", transformOrigin: "top left" };
    }
    // diagonal TR-BL
    if (line[0] === 2 && line[1] === 4 && line[2] === 6) {
      return { top: "0px", left: "330px", width: "5px", height: "330px", transform: "rotate(-45deg)", transformOrigin: "top right" };
    }
    return {};
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Tic Tac Toe</h1>
      <div
        style={{
          marginBottom: "15px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: winner ? "#ff4d4d" : "#333",
        }}
      >
        {status}
      </div>

      <div style={{ position: "relative" }}>
        {/* Winning line overlay */}
        {winningLine && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "#ff4d4d",
              ...getLineStyle(winningLine),
              zIndex: 1,
            }}
          />
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 100px)",
            gap: "10px",
          }}
        >
          {squares.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                width: "100px",
                height: "100px",
                fontSize: "2.5rem",
                fontWeight: "bold",
                borderRadius: "15px",
                border: "2px solid #333",
                cursor: squares[index] || winner ? "not-allowed" : "pointer",
                backgroundColor: value === "X" ? "#4dabf7" : value === "O" ? "#ff6b6b" : "#f0f0f0",
                color: value ? "#fff" : "#333",
                transition: "all 0.3s ease",
                zIndex: 2,
              }}
              onMouseOver={(e) => {
                if (!squares[index] && !winner) e.target.style.backgroundColor = "#a0c4ff";
              }}
              onMouseOut={(e) => {
                if (!squares[index] && !winner) e.target.style.backgroundColor = "#f0f0f0";
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setSquares(Array(9).fill(null));
          setXIsNext(true);
          setWinningLine(null);
        }}
        style={{
          marginTop: "25px",
          padding: "10px 25px",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#20c997",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#38d9a9")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#20c997")}
      >
        Restart Game
      </button>
    </div>
  );
}

export default App;
