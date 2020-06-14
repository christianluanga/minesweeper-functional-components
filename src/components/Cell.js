import React from "react";

/**Takes 3 arguments and returns a cell - a JSX Element of type div  
 * @param value an object containing a flag, mine and neighbor info
 * @param handleClick a fn that is called when a cell is clicked
 * @param handlecMenu a fn that is called when a cell is right clicked
 * @returns a JSX Element with the which can be a flag, a bomb or null
*/
const Cell = (props) => {
  const { value, handleClick, handlecMenu } = props;
  const getValue = () => {
    /*Return the flag icon if the cell's isFlagged prop is true
    or null if the cell has been revealed yet */
    if (!value.isRevealed) {
      return value.isFlagged ? "🚩" : null;
    }
    /*Return the bomb flag icon if the cell's isMine prop is true */
    if (value.isMine) {
      return "💣";
    }
    /*Return 0 is the clicked cell has no bomb in the neghboring cells */
    if (value.neighbour === 0) {
      return null;
    }
    /*Return the number of neighboring cells containing bombs */
    return value.neighbour;
  };
  let className =
    "cell" +
    (value.isRevealed ? "" : " hidden") +
    (value.isMine ? " is-mine" : "") +
    (value.isFlagged ? " is-flag" : "");

  return (
    <div
      onClick={handleClick}
      className={className}
      onContextMenu={handlecMenu}
    >
      {getValue()}
    </div>
  );
};
export { Cell };
