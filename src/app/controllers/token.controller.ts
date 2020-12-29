import {Request, Response} from 'express';
import {
    createTokens,
    updateTokens
} from "../helpers/token.helper";
import {JsonWebTokenError, TokenExpiredError, verify} from "jsonwebtoken";
import Token, {IToken} from '../models/token';


const {secret, tokens} = require('../../config/app').jwt;

type verifyRefreshType = {
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
    let payload: { type: any; id: any; iat?: number; exp?: number; };
    try {
        payload = <verifyRefreshType>await verify(refreshToken, secret);
        if (payload.type !== tokens.refresh.type) {
            res.status(400).json({message: 'Недейстивтельный токен'});
            return;
        }
        Token.find().exec().then((tokens: IToken[]) => {
            let tokenId: IToken | null = null;
            tokens.forEach(async token => {
                if (payload.id === Buffer.from(token.tokenId, 'base64').toString()) {
                    tokenId = token;
                    res.status(200).json(await updateTokens(token.userId, token._id));
                }
            })
            if (tokenId === null) {
                throw new Error('Токен не действителен');
            }
        })
            .catch(err => res.status(400).json({message: err.message}));
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.status(400).json({message: e.message});
            return;
        } else if (e instanceof JsonWebTokenError) {
            res.status(400).json({message: e.message});
            return;
        }
    }
};


export default {
    create,
    refresh,
};
