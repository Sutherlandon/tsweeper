import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Game from '../game';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('game snapshot test', () => {
  const game = renderer.create(<Game />);
  let tree = game.toJSON();
  expect(tree).toMatchSnapshot();
});
