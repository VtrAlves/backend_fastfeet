import { Request, Response } from 'express'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(4)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }
    console.log('Email Exists')
    const emailExists = await User.findOne({ where: { email: req.body.email } })

    if (emailExists) {
      res.status(400).json({ message: 'User already exists.' })
    }

    const { id, name, email } = await User.create(req.body)

    return res.json({
      message: 'User created successfuly',
      data: { id, name, email }
    })
  }

  async update (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      name: Yup.string().notRequired(),
      email: Yup.string()
        .email()
        .notRequired(),
      password: Yup.string()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ message: 'Invalid data.' })
    }

    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'Invalid id ' })
    }

    const user = await User.findByPk(id)

    const { email, oldPassword } = req.body

    if (email && user.email !== email) {
      const userExists = await User.findOne({ where: email })

      if (userExists) {
        return res.status(400).json({ message: 'Email already exists' })
      }

      if()
    }

    return res.json({ message: 'Em desenvolvimento' })
  }

  async read (req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'Em desenvolvimento' })
  }

  async delete (req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'Em desenvolvimento' })
  }
}

export default new UserController()
