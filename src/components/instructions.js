import React, { Fragment } from 'react';

const Instructions = () => (
  <Fragment>
    <div className='line'>To play the game:</div>
    <div className='line'>
      &nbsp;&nbsp;(1) Type a number to select a command from the command list, then press 'Enter'. 
    </div>
    <div className='line'>
      &nbsp;&nbsp;(2) Type coordinates of a space, as a two digit number, then press 'Enter',
      to run the selected command on the specified space, ie. '34' for (3, 4) where 3 is the row,
      and 4 is the column.
    </div>
    <br />
    <div className='line'>
      Note: Revealing a space already revealed will reveal all hidden neighbors
      if there are enough flags on its neighbors to account for all the bombs it may be touching. 
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