import React, { Fragment } from 'react';

const Instructions = () => (
  <Fragment>
    <div className='line'>To play the game:</div>
    <div className='line'>
      &nbsp;&nbsp;(1) Enter a number to select a command from the command list. 
    </div>
    <div className='line'>
      &nbsp;&nbsp;(2) Enter coordinates of a space, as a two digit number, to run the selected
      command on, ie. '34' for (3, 4) where 3 is the row, and 4 is the column.
    </div>
    <br />
    <div className='line'>Command List:</div>
    <div className='line'>
      &nbsp;&nbsp;(1) Reveal - Reveal the space specified.
    </div>
    <div className='line'>
      &nbsp;&nbsp;(2) Flag - Flag the space specified.
    </div>
    <div className='line'>
      &nbsp;&nbsp;(3) Help - Opens this dialog.
    </div>
    <div className='line'>
      &nbsp;&nbsp;(4) Close - Closes this dialog.
    </div>
  </Fragment>
);

export default Instructions;