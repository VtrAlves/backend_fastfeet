import { Router } from 'express'

import UserController from './app/controllers/User'
import SessionController from './app/controllers/Session'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/login', SessionController.store)

routes.put('/users', UserController.update)

export default routes
