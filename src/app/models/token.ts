import mongoose, {Schema, Document} from 'mongoose';

export interface IToken extends Document {
    tokenId: string;
    readonly userId: string;
}

const TokenSchema: Schema = new Schema({
    tokenId: {type:String, required: true},
    userId: {type:String, required: true},
});


TokenSchema.pre("save", function save(next) {
    const token = this as IToken;
    if (!token.isModified("tokenId")) { return next(); }
    token.tokenId  = Buffer.from(token.tokenId, 'utf-8').toString('base64');
    next();
});

export default mongoose.model <IToken>('Tokens', TokenSchema);
