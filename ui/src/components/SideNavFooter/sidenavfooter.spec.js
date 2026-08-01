// @ll-compat-audit: ok 2026-08-01
import React from 'react';
import 'jest-styled-components';
import renderer from 'react-test-renderer';
import SideNavFooter from './index.js';

describe('SideNavFooter', () => {
  test('should render', () => {
    const sideNav = renderer
      .create(<SideNavFooter />)
      .toJSON();

    expect(sideNav).toMatchSnapshot();
  });
});
