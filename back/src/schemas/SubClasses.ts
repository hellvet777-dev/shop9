import { Document, Schema, Model, model } from 'mongoose'
import { WooCategorias } from './WooCategorias'

interface T {
  tabela: string
  preco: string
  promocional: string
}

export interface SubClassesModel extends Document {
  precos: string
}

const SubClassesSchema = new Schema({
  codigo: String,
  nome: String,
  name: String,
  id: String,
  tipo: String,
  description: String,
})

SubClassesSchema.pre('validate', async function () {
  this.nome = `${this.nome}`.trim().replace('  ', ' ').replace('&', '&amp;')

  let nome: string =
    `${this.nome}`.charAt(0).toUpperCase() + `${this.nome}`.slice(1)

  let nomeNoupercase: string = `${this.nome}`

  let wooCategoria = await WooCategorias.findOne({ name: nome })

  if (wooCategoria) {
    this.name = nome
    this.id = wooCategoria.id
  } else {
    wooCategoria = await WooCategorias.findOne({ name: nomeNoupercase })
    if (wooCategoria) {
      this.name = nomeNoupercase
      this.id = wooCategoria.id
    } else {
      console.log(`Não tem codigo:${this.codigo} - ${this.tipo} - ${this.nome}`)
    }
  }
})

SubClassesSchema.post('validate', function () {
  this.nome = undefined
})

export const SubClasses: Model<SubClassesModel> = model<SubClassesModel>(
  'SubClasses',
  SubClassesSchema
)
