import { Router } from 'express'

import UserController from './app/controllers/User'
import SessionController from './app/controllers/Session'
import RecipientController from './app/controllers/Recipient'

import authMiddleware from './app/middlewares/auth'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

routes.post('/recipients', RecipientController.store)
routes.put('/users/:id', UserController.update)

export default routes
