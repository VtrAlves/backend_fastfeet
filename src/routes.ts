import { Router } from 'express'
import multer from 'multer'

import DeliveryController from './app/controllers/Delivery'
import DeliverymanController from './app/controllers/Deliveryman'
import FileController from './app/controllers/File'
import RecipientController from './app/controllers/Recipient'
import SessionController from './app/controllers/Session'
import UserController from './app/controllers/User'

import authMiddleware from './app/middlewares/auth'
import adminMiddleware from './app/middlewares/administrator'
import multerConfig from './config/multer'

const routes = Router()
const uploads = multer(multerConfig)

routes.post('/sessions', SessionController.store)
routes.post('/users', UserController.store)

/* AUTH ROUTES */

routes.use(authMiddleware)

routes.get('/recipients', RecipientController.index)

routes.post('/files', uploads.single('file'), FileController.store)
routes.post('/recipients', RecipientController.store)

routes.put('/users/:id', UserController.update)

/* ADMIN ROUTES */

routes.use(adminMiddleware)

routes.get('/deliveryman', DeliverymanController.index)

routes.post('/delivery', DeliveryController.store)
routes.post('/deliveryman', DeliverymanController.store)

routes.put('/deliveryman/:id', DeliverymanController.update)

routes.delete('/deliveryman/:id', DeliverymanController.delete)

export default routes
