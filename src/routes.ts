import { Router } from 'express'
import multer from 'multer'

import DeliverymanController from './app/controllers/Deliveryman'
import FileController from './app/controllers/File'
import RecipientController from './app/controllers/Recipient'
import SessionController from './app/controllers/Session'
import UserController from './app/controllers/User'

import authMiddleware from './app/middlewares/auth'
import multerConfig from './config/multer'

const routes = Router()
const uploads = multer(multerConfig)

routes.post('/sessions', SessionController.store)
routes.post('/users', UserController.store)

routes.use(authMiddleware)

routes.get('/deliveryman', DeliverymanController.index)

routes.post('/deliveryman', DeliverymanController.store)
routes.post('/files', uploads.single('file'), FileController.store)
routes.post('/recipients', RecipientController.store)

routes.put('/deliveryman/:id', DeliverymanController.update)
routes.put('/users/:id', UserController.update)

routes.delete('/deliveryman/:id', DeliverymanController.delete)

export default routes
