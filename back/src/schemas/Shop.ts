import { Document, Schema, Model, model } from 'mongoose'
import { ShopInterface } from '../interfaces/Shop'
import convertGrupoShopToWoo from '../services/convertGrupoShopToWoo'
import { Woo } from './Woo'
import { SubClasses } from './SubClasses'

interface T {
  tabela: string
  preco: string
  promocional: string
}

export interface ShopModel extends ShopInterface, Document {
  precos: string
}

function selectPreco(p: [T]): string {
  if (p.length < 1) return '0'

  const result = p.filter((preco) => preco.tabela == 'BALCAO')

  if (result.length < 1) return '0'

  const preco = result[0].preco || '0'

  return preco
}

const ShopSchema = new Schema({
  codigo: String,
  nome: String,
  precos: { type: String, set: selectPreco },
  observacao1: String,
  estoqueAtual: String,
  codigoGrupo: String,
  codigoClasse: String,
  codigoSubclasse: String,
  sku: String,
  id: String,
  name: String,
  regular_price: String,
  manage_stock: Boolean,
  stock_quantity: Number,
  description: String,
  short_description: String,
  categories: Array,
  publicaProduto: Boolean,
})

ShopSchema.pre('validate', async function () {
  this.sku = this.codigo
  this.name = this.nome
  this.regular_price = this.precos
  this.manage_stock = true
  this.stock_status = 'instock'
  this.stock_quantity = this.estoqueAtual

  const classes = await SubClasses.find({
    $or: [
      { tipo: 'codigoGrupo', codigo: this.codigoGrupo },
      { tipo: 'codigoClasse', codigo: this.codigoClasse },
      { tipo: 'codigoSubclasse', codigo: this.codigoSubclasse },
    ],
  }).select('id')

  let categories = []

  for (const Item of classes) {
    categories.push({ id: Item.id })
  }

  this.categories = categories

  this.publicaProduto = this.stock_quantity === 0 ? false : true
  const idWoo = await Woo.findOne({ sku: this.codigo }).select('id')
  if (idWoo) this.id = idWoo.id

  this.description = this.observacao1
  this.short_description = this.observacao1
})

ShopSchema.post('validate', function () {
  this.codigo = undefined
  this.nome = undefined
  this.precos = undefined
  this.observacao1 = undefined
  this.estoqueAtual = undefined
})

export const Shop: Model<ShopModel> = model<ShopModel>('Shop', ShopSchema)
