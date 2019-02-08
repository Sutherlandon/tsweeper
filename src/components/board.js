import React from 'react';

const Frame = (props) => {
  return (
    <div className='frame'>
      <div>0 1 2 3 4 5 6 7 8</div>
      <div>0 - - - - - - - - -</div>
      <div>1 - - - - - - - - -</div>
      <div>2 - - - - - - - - -</div>
      <div>3 - - - - - - - - -</div>
      <div>4 - - - - - - - - -</div>
      <div>5 - - - - - - - - -</div>
      <div>6 - - - - - - - - -</div>
      <div>7 - - - - - - - - -</div>
      <div>8 - - - - - - - - -</div>
  </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className='terminal'>
        <div>Would you like to play a game? y/n</div>
        <div>y</div>
        <div></div>
      </div>
    );
  }
}

export default Board;