import React, { Fragment } from 'react';

const Prompts = (props) => {
  if (props.gameState === 'win') {
    return (
      <div className='line' style={{ color: 'green'}}>
        <span style={{ color: 'green'}}>You Lose!</span> Play again? (1) Yes, (2) No.
      </div>
    );
  }

  if (props.gameState === 'lose') {
    return (
      <div className='line'>
        <span style={{ color: 'red'}}>You Lose!</span> Play again? (1) Yes, (2) No.
      </div>
    );
  }

  let secondQ;
  if (props.action) {
    if (props.action === '1') {
      secondQ = (
        <Fragment>
          <div className='line'>> 1</div>
          <div className='line'>Space to Reveal (ie. 34):</div>
        </Fragment>
      );
    } else if (props.action === '2') {
      secondQ = (
        <Fragment>
          <div className='line'>> 2</div>
          <div className='line'>Space to Flag (ie: 29):</div>
        </Fragment>
      );
    }
  }

  return (
    <Fragment>
      <div className='line'>Commands: (1) Reveal, (2) Flag</div>
      {secondQ}
    </Fragment>
  );
};

export default Prompts;
