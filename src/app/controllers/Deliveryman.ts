import { Request, Response } from 'express'
import * as Yup from 'yup'

import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class DeliverymanController {
  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatarId: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    try {
      const { id } = await Deliveryman.create(req.body)

      const { name, email, avatar } = await Deliveryman.findByPk(id, {
        attributes: ['id', 'name', 'email'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      })

      return res.status(200).json({
        message: 'Deliveryman created successfuly',
        data: { id, name, email, avatar }
      })
    } catch (e) {
      return res.status(500).json({ message: e })
    }
  }

  async index (req: Request, res: Response): Promise<Response> {
    const newDeliveryman = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url']
      }
    })

    return res
      .status(200)
      .json({ message: 'Showing all Deliverymans', data: newDeliveryman })
  }

  async update (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatarId: Yup.number()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { id } = req.params

    const deliveryman = await Deliveryman.findByPk(id)

    if (!id || !deliveryman) {
      return res.status(400).json({ message: 'ID not found' })
    }

    const oldData = {
      id: deliveryman.id,
      name: deliveryman.name,
      email: deliveryman.email,
      avatarId: deliveryman.avatarId,
      'last update': deliveryman.updatedAt
    }

    const updated = await deliveryman.update(req.body)

    const newData = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatarId: deliveryman.avatarId,
      'last update': updated.updatedAt
    }

    return res.json({
      message: 'User Updated Successfuly',
      oldData,
      newData
    })
  }

  async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const deliveryman = await Deliveryman.findByPk(id)

    if (!id || !deliveryman) {
      return res.status(400).json({ message: 'ID not found' })
    }

    const oldData = {
      id: deliveryman.id,
      name: deliveryman.name,
      email: deliveryman.email,
      avatarId: deliveryman.avatarId
    }

    deliveryman.destroy()

    return res.json({
      message: `Deliveryman ${oldData.name} excluded successfuly`,
      data: oldData
    })
  }
}

export default new DeliverymanController()
