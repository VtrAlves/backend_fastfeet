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
    const emailExists = await User.findOne({ where: { email: req.body.email } })

    if (emailExists) {
      return res.status(400).json({ message: 'User already exists.' })
    }

    try {
      const { id, name, email } = await User.create(req.body)

      return res.status(200).json({
        message: 'User created successfuly',
        data: { id, name, email }
      })
    } catch (e) {
      return res.status(500).json({ message: e })
    }
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

    const user = await User.findByPk(id)

    if (!id || !user) {
      return res.status(400).json({ message: 'ID not found' })
    }

    const { email, oldPassword } = req.body
    if (email && user.email !== email) {
      const userExists = await User.findOne({ where: { email } })

      if (userExists) {
        return res.status(400).json({ message: 'Email already exists' })
      }
    }
    if (oldPassword && !(await user.chkPassword(oldPassword))) {
      return res.status(400).json({ message: "Passwords doesn't match" })
    }

    const oldUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      'last update': user.updatedAt
    }

    const updatedUser = await user.update(req.body)

    const newUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      'last update': updatedUser.updatedAt
    }

    return res.json({
      message: 'User Updated Successfuly',
      oldUser,
      newUser
    })
  }
}

export default new UserController()
