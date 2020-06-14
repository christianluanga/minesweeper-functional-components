import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Board } from "./components/Board";
import "./css/index.css";

const Game = () => {
  /**
    Beginner: 10 mines, 8x8 board
    Intermediate: 20 mines, 12x12 board
    Expert: 40 mines, 16x16 board
    */
  const state = {
    height: 8,
    width: 8,
    mines: 10,
  };
  const [difficulty, setDifficulty] = useState("Beginner");
  /**Handle changes on the game difficulty */
  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="game">
      <h1>Minesweeper Game</h1>
      <div className="game-info">
        <div className="instructions">
          <h4>Rules</h4>
          <p>
            You are presented with a board of squares. Some squares contain
            mines (bombs), others don't. If you click on a square containing a
            bomb, you lose. If you manage to click all the squares (without
            clicking on any bombs) or flag all the mines, you win.
          </p>
          <p>
            Clicking a square which doesn't have a bomb reveals the number of
            neighbouring squares containing bombs. Use this information plus
            some guess work to avoid the bombs.
          </p>
          <p>
            To open a square, point at the square and click on it. To mark a
            square you think is a bomb, point and right-click.
          </p>
        </div>
        
      </div>
    
      <Board gameSettings={state} 
      handleChange={handleChange}
      difficulty={difficulty}/>
    </div>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
