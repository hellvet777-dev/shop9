import { Document, Schema, Model, model } from 'mongoose'

interface T {
  tabela: string
  preco: string
  promocional: string
}

export interface WooCategoriasModel extends Document {
  name: string
}

const WooCategoriasSchema = new Schema({
  id: String,
  name: String,
})

export const WooCategorias: Model<WooCategoriasModel> =
  model<WooCategoriasModel>('WooCategorias', WooCategoriasSchema)
