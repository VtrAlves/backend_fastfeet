import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express'
import Youch from 'youch'
import { resolve } from 'path'

import routes from './routes'

import 'dotenv/config'
import './database'

class App {
  public server: express.Application

  constructor () {
    this.server = express()

    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  private middlewares (): void {
    this.server.use(express.json())
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    )
  }

  private routes (): void {
    this.server.use(routes)
  }

  private exceptionHandler (): void {
    this.server.use(
      async (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (process.env.NODE_ENV === 'development') {
          new Youch(err, req).toJSON().then(output => {
            return res.status(500).json(output)
          })
        }
        return res.status(500).json({
          message: 'Internal Server Error. Please contact system administrator'
        })
      }
    )
  }
}

export default new App().server
