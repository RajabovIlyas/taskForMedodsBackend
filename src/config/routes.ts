import {Router} from 'express';
import token from "../app/controllers/token.controller";

module.exports = (app: Router) => {
    app.post('/create_tokens/:guid',token.create);
    app.post('/refresh',token.refresh);
};
