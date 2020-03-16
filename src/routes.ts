import { Router } from 'express'
import multer from 'multer'

import FileController from './app/controllers/File'
import RecipientController from './app/controllers/Recipient'
import SessionController from './app/controllers/Session'
import UserController from './app/controllers/User'

import authMiddleware from './app/middlewares/auth'
import multerConfig from './config/multer'

const routes = Router()
const uploads = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

routes.post('/files', uploads.single('file'), FileController.store)
routes.post('/recipients', RecipientController.store)

routes.put('/users/:id', UserController.update)

export default routes
