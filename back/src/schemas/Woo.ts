import { Document, Schema, Model, model } from 'mongoose'

interface T {
  tabela: string
  preco: string
  promocional: string
}

export interface WooModel extends Document {
  name: string
}

const WooSchema = new Schema({
  id: String,
  sku: String,
  name: String,
})

export const Woo: Model<WooModel> = model<WooModel>('Woo', WooSchema)
