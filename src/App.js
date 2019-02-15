import React, { Component } from 'react';
import Game from './components/game';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-container">
          <Game />
        </header>
      </div>
    );
  }
}

export default App;
