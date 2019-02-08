import React from 'react';

const Cell = (props) => {
  /**
   * f - flagged
   * b - bomb
   * h - hidden
   */
  return {
    flagged: <span style={{color: 'green'}}>F</span>,
    bomb: <span style={{color: 'red'}}>*</span>,
    hidden: <span style={{color: 'white'}}>-</span>,
  }[props.state] || <span style={{color: 'white'}}>{props.neighbors}</span>;
};

export default Cell;