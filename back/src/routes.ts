import { Router } from 'express'

import NewShopController from './controllers/NewShopController'
import NewWooController from './controllers/NewWooController'

const routes = Router()

routes.get('/shop', NewShopController.index)
routes.post('/shop', NewShopController.store)
routes.get('/shop/update', NewShopController.update)
routes.get('/shop/create', NewShopController.create)
routes.get('/shop/auth', NewShopController.auth)
routes.post('/shop/all', NewShopController.all)
routes.get('/shop/all', NewShopController.images)
routes.get('/shop/subClasses', NewShopController.subClasses)
routes.post('/shop/subClasses', NewShopController.getSubClasses)

routes.get('/shop/createClasses', NewShopController.createClasses)
routes.get('/shop/updateClasses', NewShopController.updateClasses)

routes.get('/woo', NewWooController.index)
routes.post('/woo', NewWooController.store)
routes.get('/woo/categorias', NewWooController.wooCategorias)
routes.post('/woo/categorias', NewWooController.getWooCategorias)

export default routes
