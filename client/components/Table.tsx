import React from "react";
import Cell from "./Cell";

interface Props {
  squares: number[][];
  addMovement: (pos: { x: number; y: number }) => void;
}

const Table: React.FC<Props> = ({ addMovement, squares }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((row, x) => {
        return row.map((cell, y) => {
          return <Cell key={`row-${y}-col-${x}`} content={cell} onClick={() => addMovement({ x, y })} />;
        });
      })}
    </div>
  );
};

export default Table;
