import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as Yup from 'yup'

import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
  async store (req: Request, res: Response): Promise<Response> {
    const shape = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    })

    if (!(await shape.isValid(req.body))) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: `User ${email} not found` })
    }

    if (!user.chkPassword(password)) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    const { id, name } = user

    return res.json({
      message: 'Token generated successfully',
      user: { id, name },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new SessionController()
