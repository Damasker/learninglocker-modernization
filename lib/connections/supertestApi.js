// @ll-compat-audit: ok 2026-08-01
import request from 'supertest';
import app from 'api/server';

const apiApp = request(app);

const getApiApp = () => apiApp;

export default getApiApp;
