import React, { Fragment } from 'react';

const Prompts = (props) => {
  if (props.gameState === 'win') {
    return <div className='line' style={{ color: 'green'}}>You Win! Refresh to play again.</div>
  }

  if (props.gameState === 'lose') {
    return <div className='line' style={{ color: 'red'}}>You Lose! Refresh to try again.</div>
  }

  let secondQ;
  if (props.action) {
    if (props.action === '1') {
      secondQ = (
        <Fragment>
          <div className='line'>> 1</div>
          <div className='line'>Space to reveal (ie. 34):</div>
        </Fragment>
      );
    } else if (props.action === '2') {
      secondQ = (
        <Fragment>
          <div className='line'>> 2</div>
          <div className='line'>Space to flag (ie: 29):</div>
        </Fragment>
      );
    }
  }

  return (
    <Fragment>
      <div className='line'>Commands: (1) Reveal, (2) flag</div>
      {secondQ}
    </Fragment>
  );
};

export default Prompts;
