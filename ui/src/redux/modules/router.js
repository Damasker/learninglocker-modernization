// @ll-compat-audit: ok 2026-08-01
import { createSelector } from 'reselect';
import get from 'lodash/get';

export const routerSelector = state => state.router;

export const activeOrgIdSelector = createSelector(
  routerSelector,
  router => get(router, ['route', 'params', 'organisationId'])
);
