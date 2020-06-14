import React, { useState } from "react";
import { Cell } from "./Cell";
import "../css/index.css";
const Board = (props) => {
  const { height, width, mines } = props.gameSettings;
  const handleChange = props.handleChange;
  const difficulty = props.difficulty;

  /**Initial game difficulty - beginner is the default  */
  const initBoardState = {
    boardData: gameBoardData(height, width, mines),
    gameWon: false,
    mineCount: mines,
  };
  const [boardState, setBoardSate] = useState(initBoardState);
  /**Handles the start button click event that changes the game difficulty*/
  const handleClick = () => {
      const {height, width, mines} = handleGameDifficulty(difficulty)
    setBoardSate({
      boardData: gameBoardData(height,width,mines),
      gameWon: false,
      mineCount: mines
    });
  };
  /**reveals the whole board when the game is over with either win or loss status*/
  const revealBoard = () => {
    const { boardData } = boardState;
    let updatedData = boardData;
    updatedData.forEach((datarow) => {
      datarow.forEach((dataitem) => {
        dataitem.isRevealed = true;
      });
    });
    setBoardSate({
      ...boardState,
      boardData: updatedData,
    });
  };

  /**Handle the click on each cell*/
  const handleCellClick = (x, y) => {
    let win = false;
    const { boardData } = boardState;
    // check if revealed. return if true.
    if (boardData[x][y].isRevealed) return null;

    /**reaveal the whole game board and terminate the gama if the 
     * clicked cell is a mine*/
    if (boardData[x][y].isMine) {
      revealBoard();
      alert("game over");
    }

    let updatedData = boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    /*Reveal the clicked cell if it's not a mine */
    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(height, width, x, y, updatedData);
    }
    
    /**check whether all the number of hidden cells equals the number 
     * of bombs in the board, if that's the case, the game is over and 
     * the user won*/
    if (getHidden(updatedData).length === mines) {
      win = true;
      revealBoard();
      alert("You Win");
    }
    /*set the new board state bu calling the setBoardSate dispatch */
    setBoardSate({
      boardData: updatedData,
      mineCount: mines - getFlags(updatedData).length,
      gameWon: win,
    });
  };

  /**Mark a cell as a flag when the user right clicks on a cell */
  const _handleContextMenu = (e, x, y) => {
    e.preventDefault();
    const { mineCount, boardData } = boardState;
    let updatedData = boardData;
    let mines = mineCount;
    let win = false;

    // check if already revealed
    if (updatedData[x][y].isRevealed) return;

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if (mines === 0) {
      const mineArray = getMines(updatedData);
      const FlagArray = getFlags(updatedData);
      win = JSON.stringify(mineArray) === JSON.stringify(FlagArray);
      if (win) {
        revealBoard();
        alert("You Win");
      }
    }

    setBoardSate({
      ...boardState,
      boardData: updatedData,
      mineCount: mines,
      gameWon: win,
    });
  };

  /**Recursively place all the cell on the board */
  const renderBoard = (data) => {
    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              handleClick={() => handleCellClick(dataitem.x, dataitem.y)}
              handlecMenu={(e) => _handleContextMenu(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  };
  const { mineCount, gameWon, boardData } = boardState;
  return (
    <div className="board">
        <div className="board-div">
      <h4>Select a level and click "start"</h4>
      <span className="info">
        Level:
        <select value={difficulty} onChange={handleChange}>
          <option value="beginner"> Beginner </option>
          <option value="intermediate"> Intermediate </option>
          <option value="expert"> Expert </option>
        </select>
      </span>
      <button onClick={handleClick}>Start</button>
      <div className="game-info">
        <span className="info">Mines: {mineCount}</span>
        <br />
        <span className="info">{gameWon ? "You Win" : ""}</span>
      </div>
      
      {renderBoard(boardData)}
      </div>
    </div>
  );
};
/**Get the game difficulty
 * @param difficulty
 * @returns an object containg the board (width and heiht) and the number 
 * of mines in the board for that particular difficulty level
 */
const handleGameDifficulty = (difficulty) => {
    if (difficulty === "beginner") {
      return ({
        height: 8,
        width: 8,
        mines: 10,
      });
    } 
    else if (difficulty === "intermediate") {
      return {
        height: 12,
        width: 12,
        mines: 20,
      };
    } 
    else {
      return {
        height: 16,
        width: 16,
        mines: 40,
      };
    }
  };
/**Run through the board and the all cells with property isMine set to true */
const getMines = (data) => {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (dataitem.isMine) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
};

/**Run through the board and the all cells with property isFlagged set to true */
const getFlags = (data) => {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (dataitem.isFlagged) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
};

/**Get all cells that haven't been revealed or flagged*/
const getHidden = (data) => {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (!dataitem.isRevealed) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
};

// Randomize the mines placement on the board
const getRandomNumber = (dimension) => {
  // return Math.floor(Math.random() * dimension);
  return Math.floor(Math.random() * 1000 + 1) % dimension;
};

/**Given the number or rows and columns return a rowsxcolumns board
 * containing the number of mines passed
 * @param height number 
 * @param width number
 * @param mines number
 * @returns rowsxcolumns array of objects
 */
const gameBoardData = (height, width, mines) => {
  let data = [];
  for (let i = 0; i < height; i++) {
    data.push([]);
    for (let j = 0; j < width; j++) {
      data[i][j] = {
        x: i,
        y: j,
        isMine: false,
        neighbour: 0,
        isRevealed: false,
        isEmpty: false,
        isFlagged: false,
      };
    }
  }
  data = plantMines(data, height, width, mines);
  data = getNeighbours(data, height, width);
  return data;
};

/**Plants the mines on the board
 * @param data - the rowsxcolumns board
 * @param height - the number of rows
 * @param width - the number of columns
 * @param mines - the total number of mines to be planted
 * @returns rowsxcolumns board with mines planted
*/
const plantMines = (data, height, width, mines) => {
  let randomx,
    randomy,
    minesPlanted = 0;

  while (minesPlanted < mines) {
    randomx = getRandomNumber(width);
    randomy = getRandomNumber(height);
    if (!data[randomx][randomy].isMine) {
      data[randomx][randomy].isMine = true;
      minesPlanted++;
    }
  }

  return data;
};

/**Plants the mines on the board
 * @param data - the rowsxcolumns board
 * @param height - the number of rows
 * @param width - the number of columns
 * @returns rowsxcolumns board contaning mines neighboring cells
*/
const getNeighbours = (data, height, width) => {
  let updatedData = data;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (data[i][j].isMine !== true) {
        let mine = 0;
        const area = traverseBoard(
          height,
          width,
          data[i][j].x,
          data[i][j].y,
          data
        );
        area.map((value) => {
          if (value.isMine) {
            mine++;
          }
        });
        if (mine === 0) {
          updatedData[i][j].isEmpty = true;
        }
        updatedData[i][j].neighbour = mine;
      }
    }
  }

  return updatedData;
};

// looks for neighbouring cells and returns them
const traverseBoard = (height, width, x, y, data) => {
  const el = [];

  //up
  if (x > 0) {
    el.push(data[x - 1][y]);
  }

  //down
  if (x < height - 1) {
    el.push(data[x + 1][y]);
  }

  //left
  if (y > 0) {
    el.push(data[x][y - 1]);
  }

  //right
  if (y < width - 1) {
    el.push(data[x][y + 1]);
  }

  // top left
  if (x > 0 && y > 0) {
    el.push(data[x - 1][y - 1]);
  }

  // top right
  if (x > 0 && y < width - 1) {
    el.push(data[x - 1][y + 1]);
  }

  // bottom right
  if (x < height - 1 && y < width - 1) {
    el.push(data[x + 1][y + 1]);
  }

  // bottom left
  if (x < height - 1 && y > 0) {
    el.push(data[x + 1][y - 1]);
  }

  return el;
};
/* reveal logic for empty cell */
const revealEmpty = (height, width, x, y, data) => {
  let area = traverseBoard(height, width, x, y, data);
  area.map((value) => {
    if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
      data[value.x][value.y].isRevealed = true;
      if (value.isEmpty) {
        revealEmpty(value.x, value.y, data);
      }
    }
  });
  return data;
};
export { Board };
