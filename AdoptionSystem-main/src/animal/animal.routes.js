import express from 'express'
import { registerA } from './animal.controller.js';

const api = express.Router();


api.post('/registerA', registerA)


export default api