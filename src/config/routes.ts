import {Request, Response,Router} from 'express';
import token from "../app/controllers/token.controller";

module.exports = (app: Router) => {
    app.get('/create_tokens/:guid',token.create);
    app.post('/refresh',token.refresh);
};
