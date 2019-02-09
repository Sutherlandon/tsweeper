import React from 'react';

const Cell = (props) => {
  /**
   * f - flagged
   * b - bomb
   * h - hidden
   */
  const { state, value } = props;

  if (state === 'flagged') {
    return <span style={{color: 'green'}}>F&nbsp;</span>;
  }

  if (state === 'hidden') {
    return <span style={{color: 'white'}}>-&nbsp;</span>;
  }

  // -1 for bomb
  if (value === -1) {
    return <span style={{color: 'red'}}>*&nbsp;</span>;
  }

  if (value === 0) {
    return <span style={{color: 'white'}}>&nbsp;&nbsp;</span>;
  }

  return <span style={{color: 'white'}}>{props.value}&nbsp;</span>;
};

export default Cell;