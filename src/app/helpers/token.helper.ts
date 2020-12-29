import * as jwt from "jsonwebtoken";
const {secret, tokens} = require('../../config/app').jwt;
import {v4 as uuid} from "uuid";
import Token from '../models/token';


export const generateAccessToken= async (userId:string)=>{
    const payload = {
        userId,
        type: tokens.access.type,
    };
    return jwt.sign(payload, secret, tokens.alg);
}

export const generateRefreshToken = async () => {
    const payload = {
        id:uuid(),
        type: tokens.refresh.type,
    };
    return {
        id: payload.id,
        token: jwt.sign(payload, secret,tokens.alg)
    };
};

export const replaceDbRefreshToken = async (tokenId:string, userId:string,idTable:string) => {
    Token.findByIdAndDelete(idTable)
        .exec()
        .then(() => {
            Token.create({tokenId, userId})
        })
        .catch(() => {
            Token.create({tokenId, userId})
        });
};

export const createDbToken= async (tokenId:string, userId:string)=>{
    return Token.create({tokenId, userId})
}

export const updateTokens = async (userId: string,idTable:string) => {
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken();
    await replaceDbRefreshToken(refreshToken.id, userId,idTable);
    return {
        access:accessToken,
        refresh: refreshToken.token
    };
};

export const createTokens = async (userId: string) => {
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken();
    createDbToken(refreshToken.id, userId);
    return {
        access:accessToken,
        refresh: refreshToken.token
    };
};