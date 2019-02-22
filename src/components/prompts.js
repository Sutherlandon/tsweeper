import React, { Fragment } from 'react';

const Prompts = (props) => {
  if (props.gameState === 'win') {
    return (
      <Fragment>
        <div className='line' style={{ color: 'green'}}>You Win! :D</div>
        <div className='line'>Play again? (1) Yes, (2) No.</div>
      </Fragment>
    );
  }

  if (props.gameState === 'lose') {
    return (
      <Fragment>
        <div className='line' style={{ color: 'red'}}>You lose! :(</div>
        <div className='line'>Try again? (1) Yes, (2) No.</div>
      </Fragment>
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className='line'>Commands:&nbsp;</div>
        <div className='line commandList'>
          <div className='command'>(1)Reveal,&nbsp;</div>
          <div className='command'>(2)Flag,&nbsp;</div>
          <div className='command'>(3)Help</div>
        </div>
      </div>
      {secondQ}
    </Fragment>
  );
};

export default Prompts;
