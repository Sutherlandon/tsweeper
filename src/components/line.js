import React from 'react';
import Cell from './cell';

const Line = (props) => {
  return (
    <div className='line'>
      <span className='index'>{props.index} </span>
      {props.cells.map((cell, i) =>
        <Cell key={`cell_${props.index}_${i}`} value={cell.value} state={cell.state} />
       )}
    </div>
  );
}

export default Line;