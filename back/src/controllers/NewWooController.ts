import { Request, Response } from 'express'
import { Woo } from '../schemas/Woo'
import { WooCategorias } from '../schemas/WooCategorias'
import { woo } from '../services/api'

interface ShopResponse {
  sucesso: boolean
  mensagem: string
  tipo: string
  complementoTipo: string
  statusCode: number
  dados: [] | null
}

class NewWooController {
  public async index(req: Request, res: Response): Promise<Response> {
    const produtos = await Woo.find()

    return res.json({ length: produtos.length, produtos })
  }

  public async store(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)

    const { pageInitial, allPages, dropCollection, per_page } = req.body

    if (dropCollection) {
      try {
        await Woo.collection.drop()
      } catch (error) {
        console.log('error', error)
      }
    }

    let page = pageInitial
    let total = 0
    let totalpages
    let result

    do {
      console.log('page', page)
      let result = await woo.get(`products?page=${page}&per_page=${per_page}`)
      let { data } = result

      if (data) await Woo.insertMany(data)

      total = result.headers['x-wp-total']
      totalpages = result.headers['x-wp-totalpages']

      page += 1
    } while (`${page - 1}` !== totalpages && allPages)

    return res.json({ message: `${total} produtos carregados` })
  }

  public async wooCategorias(req: Request, res: Response): Promise<Response> {
    const categorias = await WooCategorias.find()

    return res.json({ length: categorias.length, categorias })
  }

  public async getWooCategorias(
    req: Request,
    res: Response
  ): Promise<Response> {
    req.setTimeout(500000)

    const { pageInitial, allPages, dropCollection, per_page } = req.body

    if (dropCollection) {
      try {
        await WooCategorias.collection.drop()
      } catch (error) {
        console.log('error', error)
      }
    }

    let page = pageInitial
    let total = 0
    let totalpages
    let result

    do {
      console.log('page', page)
      let result = await woo.get(
        `products/categories?page=${page}&per_page=${per_page}`
      )
      let { data } = result

      if (data) await WooCategorias.insertMany(data)

      total = result.headers['x-wp-total']
      totalpages = result.headers['x-wp-totalpages']

      page += 1
    } while (`${page - 1}` !== totalpages && allPages)

    return res.json({ message: `${total} categorias carregadas` })
  }
}

export default new NewWooController()
