import React, { Component, Fragment } from 'react';
import Prompts from './prompts';
import Board from './board';
import Instructions from './instructions';

const BOARD_SIZE = 9;

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 0,
      gameState: '',
      terminalInput: '',
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Builds a new board to play on
   */ 
  buildBoard() {
    // a cell state can be flagged, hidden, or revealed
    // a cell value is the number of bombs it is neighboring or -1 if bomb
    let board = []
    while (board.length < BOARD_SIZE) {
      let row = [];
      while (row.length < BOARD_SIZE) {
        row.push({ state: 'hidden', value: 0 });
      }
      board.push(row);
    }

    // distribute bombs
    let numBombs = 0;
    while (numBombs <= BOARD_SIZE) {
      // get a random cell
      let x = Math.floor(Math.random() * Math.floor(BOARD_SIZE)) 
      let y = Math.floor(Math.random() * Math.floor(BOARD_SIZE)) 

      // if it is not a bomb make it one
      if (board[x][y].value !== -1) {
        board[x][y].value = -1;
        numBombs += 1;
      }
    }

    // calculates the value of a cell
    const countNeighborBombs = (x, y) => {
      let neighbors = 0;
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // if this cell is not out of bounds and is a bomb
          if (!(i === x && j === y) && this.inBounds(i, j) && board[i][j].value === -1) {
            neighbors += 1;
          }
        }
      }
      return neighbors;
    }

    // calculate the rest of the cells values
    board.forEach((line, i) => {
      line.forEach((cell, j) => {
        if (cell.value !== -1) {
          cell.value = countNeighborBombs(i, j);
        }
      })
    })

    // put the game in the beginning state
    this.setState({
      action: 0,
      board,
      donePlaying: false,
      gameState: '',
      terminalInput: '',
    });
  }

  /**
   * Scans the board and determines if the game has been won
   */
  checkForWin() {
    const { board } = this.state;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        // if bomb and not revealed
        if (board[i][j].value !== -1 && board[i][j].state === 'hidden') {
          return false;
        }
      }
    }

    this.setState({ gameState: 'win' });
  }

  componentDidMount() {
    // build the game
    this.buildBoard();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  /**
   * Handles changes in the text field
   * @param {*} event 
   */
  handleChange(event) {
    let terminalInput, { value } = event.target;
    if (value.match(/^[0-BOARD_SIZE]*/)) {
      if (['1', '2'].includes(this.state.action)) {
        terminalInput = value.substring(0, 2);
      } else {
        terminalInput = value.substring(0, 1);
      }

      this.setState({ terminalInput });
    }
  }

  /**
   * Handles submitting of a command
   * @param {*} event 
   */
  handleSubmit(event) {
    event.preventDefault();
    const { action, gameState, terminalInput: value } = this.state;

    if (!action) {
      // validate the command given
      if (!['1', '2', '3', '4'].includes(value)) {
        this.setState({
          error: `${value} is not a valid command`,
          terminalInput: '',
        });
      } else if ( value === '3') {
        this.setState({ showInstructions: true });
        this.prepareForNextMove();
      } else if ( value === '4') {
        if (this.state.showInstructions) {
          this.setState({ showInstructions: false });
          this.prepareForNextMove();
        } else {
          this.setState({
            action: 0,
            error: 'The Instructions dialog is not open',
            terminalInput: '',
          });
        }
      } else {
        // if the game is over, build a new game or say goodbye
        if (['win', 'lose'].includes(gameState)) {
          if (value === '1') {
            this.buildBoard();
          } else {
            this.setState({ donePlaying: true });
          }
        } else {
          this.setState({
            action: value,
            error: '',
            terminalInput: '',
          });
        }
      }
    } else {
      if (value.length < 2) {
        this.setState({
          error: 'Your coordinates must be given as a two digit number'
        });
        return;
      }

      // parse the coordinates
      const x = parseInt(value.substring(0, 1));
      const y = parseInt(value.substring(1, 2));
      const { board } = this.state;

      // reveal or flag the specified space
      if (action === '1') {
        this.revealSaidSpace(x, y);
        this.checkForWin();
      } else if (action === '2') {
        // validate the flag
        if (board[x][y].state === 'revealed') {
          this.setState({
            error: `${x},${y} has already been revealed`,
            action: 0,
            terminalInput: '',
          });
        } else {
          board[x][y].state = 'flagged';
          this.setState({ board });
          this.prepareForNextMove();
        }
      }
    }
  }

  /**
   * Checks to see if Coordinates are in bounds
   * @param {*} x 
   * @param {*} y 
   */
  inBounds(x, y) {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  }

  /**
   * Reveals the specified space and cascades if it's a bomb or blank
   * @param {*} x The x coordiate of the space to reveal
   * @param {*} y The y corrdiate of the space to reveal
   * @param {*} cascade Flag to specify if user input triggered this function or a cascade did
   */
  revealSaidSpace(x, y, cascade = false) {
    const { board } = this.state;

    // error if coordinates out of bounds
    if (!this.inBounds(x,y)) {
      // if reveal is due to a cascase, do not error on out of bounds
      if (cascade) { return; }

      this.setState({
        action: 0,
        error: `${x},${y} is out of bounds`,
        terminalInput: '',
      });

    // error if coordinates already revealed
    } else if (board[x][y].state === 'revealed') {
      // if reveal is due to a cascade, do not error on already revealed
      if (cascade) { return; }

      this.revealAllButFlaggedNeighbors(x, y);
      
    // passed all pre-checks, reveal the space
    } else {
      let gameState;

      // reveal the space
      board[x][y].state = 'revealed';

      // if it's a bomb, reveal all bombs
      if (board[x][y].value === -1) {
        board.forEach(row => {
          row.forEach(cell => {
            if (cell.value === -1) {
              cell.state = 'revealed';
            }
          });
        });

        gameState = 'lose';

      // if no neighbors are bombs, reveal all neighbors
      } else if (board[x][y].value === 0) {
        // set this cell
        board[x][y].state = 'revealed';

        // reveal all neighbors
        // top row
        this.revealSaidSpace(x - 1, y - 1, true);
        this.revealSaidSpace(x, y - 1, true);
        this.revealSaidSpace(x + 1, y - 1, true);

        // let and right
        this.revealSaidSpace(x - 1, y, true);
        this.revealSaidSpace(x + 1, y, true);

        // bottom row
        this.revealSaidSpace(x - 1, y + 1, true);
        this.revealSaidSpace(x, y + 1, true);
        this.revealSaidSpace(x + 1, y + 1, true);
      }

      this.setState({ board, gameState });
      this.prepareForNextMove();
    }
  }

  /**
   * Counts the number of neighbors are in a list of states
   * @param {*} x  The x coordinate of the cell in question
   * @param {*} y  The y coordinate of the cell in question
   * @param {array} states  A list of states that we want to check a cell against
   */
  countNeighborsStates = (x, y, states) => {
    let neighbors = 0;
    // iterate over each neighboring cell
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ( !(i === x && j === y) && this.inBounds(i, j) &&
          states.includes(this.state.board[i][j].state)
        ) {
          neighbors += 1;
        }
      }
    }
    return neighbors;
  }

  /**
   * Counts the number of neighbors a cell has
   */
  countNeighbors(x, y) {
    return (
      (x === 0 && y === 0) || 
      (x === 0 && y === 8) ||
      (x === 8 && y === 0) ||
      (x === 8 && y === 8))
    ? 3
    : (x=== 0 || x === 8 || y === 0 || y === 8)
      ? 5
      : 8;
  }

  
  /**
   * Resets the state to blank to accept the next user command
   */
  prepareForNextMove() {
    this.setState({
      action: 0,
      error: '',
      terminalInput: '',
    });
  }

  /**
   * Reveals all the spaces around a cell that are not flagged if the number of flags
   * around the cell is the same as the number of bombs
   * @param {*} x 
   * @param {*} y 
   */
  revealAllButFlaggedNeighbors(x, y) {
    const { board } = this.state;
    const numFlags = this.countNeighborsStates(x, y, ['flagged']);
    const numFR = this.countNeighborsStates(x, y, ['flagged', 'revealed']);
    const numNeighbors = this.countNeighbors(x, y);

    console.log(numFR, numNeighbors, numFR===numNeighbors);

    // if neighbors are revealed or flagged
    if (numFR === numNeighbors) {
      this.setState({
        action: 0,
        error: `${x},${y} and it's neighbors are already revealed/flagged`,
        terminalInput: '',
      });
    } else {
      // if the number of flags around a space is the same as the number of bombs
      // it is touching, reveal all the unflagged spaces
      if ( numFlags === board[x][y].value) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            // if the neighbor is not flagged, reveal it
            if (!(i === x && j === y) && this.inBounds(i, j) && board[i][j].state !== 'flagged') {
              this.revealSaidSpace(i, j, true);
            }
          }
        }
      }
      
      this.prepareForNextMove();
    }
  }

  /**
   * render the component
   */
  render() {
    return (
      <div className='terminal'>
        <div className='line'>
          Welcome to T<span style={{color: 'red'}}>*</span>Sweeper a text based minesweeper.
        </div>
        <br/>
        {this.state.showInstructions
          ? <Instructions/>
          : <Board board={this.state.board} />
        }
        {!this.state.donePlaying
          ? (
            <Fragment>
              <Prompts action={this.state.action} gameState={this.state.gameState} />
              <div className='line' style={{ color: 'red' }}>{this.state.error}</div>
              <div className='line'>
                <form onSubmit={this.handleSubmit}>
                  > <input
                      className='terminal-input'
                      onChange={this.handleChange}
                      type='number' 
                      value={this.state.terminalInput}
                    />
                </form>
              </div>
            </Fragment>
          ) : (
            <div className='line'>
              Thanks for playing! Have a nice day! :)
            </div>
          )
        }
      </div>
    );
  }
}

export default Game;