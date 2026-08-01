// @ll-compat-audit: ok 2026-08-01
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import NotFound from './index';

test('renders correctly with no props', () => {
  const tree = ReactTestRenderer.create(<NotFound />).toJSON();
  expect(tree).toMatchSnapshot();
});
