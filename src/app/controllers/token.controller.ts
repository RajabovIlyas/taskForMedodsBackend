import {Request, Response} from 'express';
import {
    createTokens,
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken,
    updateTokens
} from "../helpers/token.helper";
import jwt, {verify, VerifyErrors} from "jsonwebtoken";
import Token, {IToken} from '../models/token';


const {secret,tokens} = require('../../config/app').jwt;

type verifyRefreshType={
    id: string,
    type: string,
    iat: number,
    exp: number
}

const create = async (req: Request, res: Response) => {
    res.json(await createTokens(req.params.guid));
}

const refresh = async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    let payload;
    try {
        payload =<verifyRefreshType> await jwt.verify(refreshToken, secret);
        console.log(payload);
        if (payload.type !== tokens.refresh.type) {
            res.status(400).json({message: 'Недейстивтельный токен'});
            return;
        }
        Token.findOne({tokenId: payload.id})
            .exec()
            .then(token => {
                if (token === null) {
                    throw new Error('Токен не действителен');
                }
                return updateTokens(token.userId,token.tokenId);
            })
            .then(tokens => res.json(tokens))
            .catch(err => res.status(400).json({message: err.message}));
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({message: e.message});
            return;
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({message: e.message});
            return;
        }
    }
};



export default {
    create,
    refresh,
};
