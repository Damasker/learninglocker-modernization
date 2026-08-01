// @ll-compat-audit: ok 2026-08-01
import { combineReducers } from 'redux';
import { duck as updateDuck, reducers as updateReducers } from './updateUserOrganisationSetting';

/**
 * Action Creators
 */
export const updateUserOrganisationSetting = updateDuck.actions.start;

/*
 * Reducers
 */
const reducers = combineReducers({
  update: updateReducers,
});
export default reducers;

/**
 * Sagas
 */
export const sagas = [
  ...updateDuck.sagas,
];
