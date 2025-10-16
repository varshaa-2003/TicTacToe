import { useState, useRef, useEffect } from "react";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState(null); // array like [0,1,2]
  const boardRef = useRef(null);
  const cellRefs = useRef([]); // will hold refs to 9 cells
  const [lineStyle, setLineStyle] = useState(null);
  const { width, height } = useWindowSize();


  function handleClick(index) {
    if (squares[index] || winningLine) return;
    const ns = [...squares];
    ns[index] = xIsNext ? "X" : "O";
    setSquares(ns);
    setXIsNext(!xIsNext);

    const winnerInfo = calculateWinner(ns);
    if (winnerInfo) setWinningLine(winnerInfo.line);
  }

  function calculateWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  }

  // compute line style from actual DOM positions
  const computeLine = () => {
    if (!winningLine || !boardRef.current) {
      setLineStyle(null);
      return;
    }
    const [i1, , i3] = winningLine; // ends of the line
    const el1 = cellRefs.current[i1];
    const el3 = cellRefs.current[i3];
    const boardRect = boardRef.current.getBoundingClientRect();

    if (!el1 || !el3) return;

    const r1 = el1.getBoundingClientRect();
    const r3 = el3.getBoundingClientRect();

    
    // center coordinates relative to board's top-left
    const x1 = r1.left - boardRect.left + r1.width / 2;
    const y1 = r1.top - boardRect.top + r1.height / 2;
    const x3 = r3.left - boardRect.left + r3.width / 2;
    const y3 = r3.top - boardRect.top + r3.height / 2;

    const midX = (x1 + x3) / 2;
    const midY = (y1 + y3) / 2;
    const dx = x3 - x1;
    const dy = y3 - y1;
    const length = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // line thickness and color
    const thickness = Math.max(6, Math.min(12, boardRect.width * 0.012)); // responsive thickness

    setLineStyle({
      position: "absolute",
      left: `${midX}px`,
      top: `${midY}px`,
      width: `${length}px`,
      height: `${thickness}px`,
      backgroundColor: "#000000",
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      transformOrigin: "center center",
      zIndex: 5,
      borderRadius: `${thickness / 2}px`,
      transition: "width 200ms ease, left 200ms ease, top 200ms ease, transform 200ms ease",
      pointerEvents: "none",
    });
  };

  // recalc whenever the winningLine changes or on resize
  useEffect(() => {
    computeLine();
    function onResize() {
      computeLine();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winningLine, squares]);

  // reset board
  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
    setLineStyle(null);
  };

  const winner = winningLine ? squares[winningLine[0]] : null;
  const status = winner ? `Winner: ${winner}` : `Next: ${xIsNext ? "X" : "O"}`;

  // helper to set cell ref
  const setCellRef = (el, i) => {
    cellRefs.current[i] = el;
  };

  return (
   <>
    {winner && (
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={300}
      />
   )} 
  
   <div
  style={{
    width: "100vw",          // ⬅️ fill the full screen width
    height: "100vh",         // ⬅️ fill full height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff", // ⬅️ white background
    padding: "18px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }}
>

      <div style={{ textAlign: "center", width: "100%", maxWidth: "520px" }}>
        <h1 style={{ margin: 0, color: "#ff776bff", fontSize: "2.4rem",textShadow: "2px 2px #222",
          fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
          letterSpacing: "3px",
          textTransform: "uppercase", }}>Tic Tac Toe</h1>
        <div style={{ marginTop: 10, marginBottom: 18, fontWeight: 600, color: winner ? "#ff4d4d" : "#333" }}>
          {status}
        </div>

        {/* Board wrapper: width is responsive but fixed for internal layout */}
        <div
          ref={boardRef}
          style={{
            margin: "0 auto",
            width: "min(360px, 80vw)", // responsive: no larger than 360px, scales down on small screens
            height: "min(360px, 80vw)",
            position: "relative",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: "10px",
            padding: "6px",
            background: "#fafafa",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          {/* winning line drawn with exact geometry */}
          {lineStyle && <div style={lineStyle} />}

          {/* cells */}
          {squares.map((val, idx) => (
            <button
              key={idx}
              ref={(el) => setCellRef(el, idx)}
              onClick={() => handleClick(idx)}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "calc(1.6rem + 1.2vw)",
                fontWeight: 700,
                borderRadius: 10,
                border: "2px solid #000000",
                background: val ? (val === "X" ? "#4dabf7" : "#ff6b6b") : "#ffffff",
                color: val ? "#fff" : "#333",
                cursor: val || winner ? "not-allowed" : "pointer",
                transition: "background 160ms ease, transform 100ms ease",
                boxSizing: "border-box",
                padding: 0,
                userSelect: "none",
              }}
              onMouseDown={(e) => {
                if (!squares[idx] && !winner) e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {val}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={reset}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#20c997",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 14px rgba(32,201,151,0.18)",
            }}
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "18px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
};

const buttonHoverStyle = {
  transform: "scale(1.1)",
  boxShadow: "0 0 20px rgba(0, 123, 255, 0.8)",
};

export default App;