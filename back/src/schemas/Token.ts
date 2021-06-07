import { Document, Schema, Model, model } from 'mongoose'

export interface TokenModel extends Document {
  token: string
  expireAt: string
}

const TokenSchema = new Schema({
  token: String,
  expireAt: String,
})

export const Token: Model<TokenModel> = model<TokenModel>('Token', TokenSchema)
