import { Router } from 'express'

import UserController from './app/controllers/User'
import SessionController from './app/controllers/Session'

const routes = Router()

routes.get('/users', UserController.read)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.put('/users/:id', UserController.update)

routes.delete('/users/:id', UserController.delete)

export default routes
