import { Request, Response } from 'express'
import { Shop } from '../schemas/Shop'
import { SubClasses } from '../schemas/SubClasses'
import { WooCategorias } from '../schemas/WooCategorias'
import shop from '../services/shop'
import { woo } from '../services/api'

interface ShopResponse {
  sucesso: boolean
  mensagem: string
  tipo: string
  complementoTipo: string
  statusCode: number
  dados: [] | null
}

class NewShopController {
  public async subClasses(req: Request, res: Response): Promise<Response> {
    const classes = await SubClasses.find()

    const shopPublish = await Shop.find()
      .where({ publicaProduto: false })
      .select('categories')

    return res.json({ shopPublish, classes })
  }

  public async getSubClasses(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)

    const grupos = await shop.todos('/aux/grupos')
    const classes = await shop.todos('/aux/classes')
    const subclasses = await shop.todos('/aux/subclasses')
    let gruposData = grupos.dados
    let classesData = classes.dados
    let subclassesData = subclasses.dados

    for (const Item of gruposData) {
      Item.tipo = 'codigoGrupo'
      Item.description = 'Grupo'
    }

    for (const Item of classesData) {
      Item.tipo = 'codigoClasse'
      Item.description = 'Classe'
    }

    for (const Item of subclassesData) {
      Item.tipo = 'codigoSubclasse'
      Item.description = 'Sub-Classe'
    }

    try {
      await SubClasses.collection.drop()
    } catch (error) {
      console.log('error', error)
    }

    try {
      await SubClasses.insertMany(gruposData)
    } catch (error) {
      console.log('error', error)
    }

    try {
      await SubClasses.insertMany(classesData)
    } catch (error) {
      console.log('error', error)
    }

    try {
      await SubClasses.insertMany(subclassesData)
    } catch (error) {
      console.log('error', error)
    }

    return res.json({
      grupos: gruposData.length,
      classes: classesData.length,
      subclasses: subclassesData.length,
      dados: classes.dados,
    })
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const produtos = await Shop.find()
    //const produtos = await Shop.where('publicaProduto', true)

    return res.json({ length: produtos.length, produtos })
  }

  public async auth(req: Request, res: Response): Promise<Response> {
    const result = await shop.auth()

    return res.json(result)
  }

  public async update(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)
    const limite = 50
    const produtos = await Shop.where('publicaProduto', true)

    const total = produtos.length
    let sliceProdutos = Array()
    let result
    let resultado = Array()

    for (const produto of produtos) {
      sliceProdutos.push(produto)

      if (sliceProdutos.length >= limite) {
        console.log('Publish', limite)
        result = await woo.post('products/batch', {
          update: sliceProdutos,
        })
        resultado.push(result.data)
        sliceProdutos = []
      }
    }

    if (sliceProdutos.length > 0) {
      console.log('Last Publish', sliceProdutos.length)
      result = await woo.post('products/batch', {
        update: sliceProdutos,
      })
      resultado.push(result.data)
    }

    return res.json({
      length: total,
      resultado,
    })
  }

  public async updateClasses(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)
    const limite = 50
    const subClasses = await SubClasses.find()
    let categoriasToUpdate = Array()
    let updateCategoria = Array()
    let resultado = Array()
    let result

    for (const subClasse of subClasses) {
      const shopPublish = await Shop.findOne({
        categories: { $in: [{ id: subClasse.id }] },
      })
        .where({ publicaProduto: true })
        .select('id')

      if (shopPublish) {
        categoriasToUpdate.push(subClasse)
      }
    }

    for (const categoria of categoriasToUpdate) {
      updateCategoria.push(categoria)

      if (updateCategoria.length >= limite) {
        console.log('Publish', limite)
        result = await woo.post('products/categories/batch', {
          update: updateCategoria,
        })
        resultado.push(result.data)
        updateCategoria = []
      }
    }

    if (updateCategoria.length > 0) {
      console.log('Last Publish', updateCategoria.length)
      result = await woo.post('products/categories/batch', {
        update: updateCategoria,
      })
      resultado.push(result.data)
    }

    return res.json({
      updateLength: categoriasToUpdate.length,
      resultado,
    })
  }

  public async deleteClassesProductsNoPublish(
    req: Request,
    res: Response
  ): Promise<Response> {
    req.setTimeout(500000)
    const limite = 50
    const subClasses = await SubClasses.find()
    let categoriasToUpdate = Array()
    let categoriasToDelete = Array()
    let deleteCategoria = Array()
    let resultado = Array()
    let result

    for (const subClasse of subClasses) {
      const shopPublish = await Shop.findOne({
        categories: { $in: [{ id: subClasse.id }] },
      })
        .where({ publicaProduto: true })
        .select('id')

      if (!shopPublish) {
        categoriasToDelete.push(subClasse)
      } else {
      }
    }

    for (const categoria of categoriasToDelete) {
      deleteCategoria.push(categoria.id)

      if (deleteCategoria.length >= limite) {
        console.log('Publish', limite)
        result = await woo.post('products/categories/batch', {
          delete: deleteCategoria,
        })
        resultado.push(result.data)
        deleteCategoria = []
      }
    }

    if (deleteCategoria.length > 0) {
      console.log('Last Publish', deleteCategoria.length)
      result = await woo.post('products/categories/batch', {
        delete: deleteCategoria,
      })
      resultado.push(result.data)
    }

    return res.json({
      deleteLength: categoriasToDelete.length,
      resultado,
    })
  }

  public async createClasses(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)
    const limite = 50
    const produtos = await SubClasses.find()

    const total = produtos.length
    let sliceProdutos = Array()
    let result
    let resultado = Array()

    for (const produto of produtos) {
      sliceProdutos.push(produto)

      if (sliceProdutos.length >= limite) {
        console.log('Publish', limite)
        result = await woo.post('products/categories/batch', {
          create: sliceProdutos,
        })
        resultado.push(result.data)
        sliceProdutos = []
      }
    }

    if (sliceProdutos.length > 0) {
      console.log('Last Publish', sliceProdutos.length)
      result = await woo.post('products/categories/batch', {
        create: sliceProdutos,
      })
      resultado.push(result.data)
    }

    return res.json({
      length: total,
      resultado,
    })
  }

  public async create(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)
    const limite = 50
    const produtos = await Shop.where('publicaProduto', true)

    const total = produtos.length
    let sliceProdutos = Array()
    let result
    let resultado = Array()

    for (const produto of produtos) {
      sliceProdutos.push(produto)

      if (sliceProdutos.length >= limite) {
        console.log('Publish', limite)
        result = await woo.post('products/batch', {
          create: sliceProdutos,
        })
        resultado.push(result.data)
        sliceProdutos = []
      }
    }

    if (sliceProdutos.length > 0) {
      console.log('Last Publish', sliceProdutos.length)
      result = await woo.post('products/batch', {
        create: sliceProdutos,
      })
      resultado.push(result.data)
    }

    return res.json({
      length: total,
      resultado,
    })
  }

  public async store(req: Request, res: Response): Promise<Response> {
    req.setTimeout(500000)
    const { pageInitial, allPages, dropCollection } = req.body

    if (dropCollection) {
      try {
        await Shop.collection.drop()
      } catch (error) {
        console.log('error', error)
      }
    }

    let page = pageInitial
    let total = 0
    let result: ShopResponse

    do {
      console.log('Page', page)
      result = await shop.produtos(page)

      if (result.dados) {
        Shop.insertMany(result.dados)
        total += result.dados.length
      }

      page += 1
    } while (result.sucesso && allPages)

    return res.json({ message: `${total} produtos carregados` })
  }

  public async all(req: Request, res: Response) {
    const { rota } = req.body
    const data = await shop.todos(rota)

    return res.send(data)
  }

  public async images(req: Request, res: Response) {
    const rota = '/fotos/7373/0'
    const data = await shop.todos(rota)

    res.setHeader('Content-Type', 'image/jpeg')

    const r = Buffer.from(data, 'ascii').toString()

    return res.send(r)

    //res.setHeader('Content-Dispositon', 'attachment; filename=' + 'test.jpeg')

    const image = Buffer.from(data, 'base64') //.toString('base64') binary

    res.write(image)
    res.end()
  }
}

export default new NewShopController()
