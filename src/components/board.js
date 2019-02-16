import React, { Fragment } from 'react';
import Line from './line';

const Board = (props) => {
  if (props.board) {
    return (
      <Fragment>
        <div className='line index'>
          &nbsp;&nbsp;0 1 2 3 4 5 6 7 8
        </div>
        {props.board.map((line, i) => <Line key={`line_${i}`} index={i} cells={line} />)}
        <br />
      </Fragment>
    );
  }

  return null;
}

export default Board;