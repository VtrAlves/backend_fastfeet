import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    req.params.userId = decoded.id

    next()
  } catch (e) {
    return res.status(401).json({ message: 'Token invalid' })
  }
}
