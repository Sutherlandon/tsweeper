import React, { Component } from 'react';
import Board from './components/board';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-container">
          <Board />
        </header>
      </div>
    );
  }
}

export default App;
