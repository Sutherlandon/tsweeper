import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Game from './game';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('calculates cell values properly', () => {
  const game = renderer.create(<Game />);
  let tree = game.toJSON();
  expect(tree).toMatchSnapshot();
});
