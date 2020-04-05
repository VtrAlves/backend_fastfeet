import { Request, Response } from 'express'
import * as Yup from 'yup'

import Problem from '../models/Problem'
import Delivery from '../models/Delivery'

class DeliveryProblemController {
  async index (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    })

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ message: 'DeliveryId needs to be a number' })
    }

    const { id } = req.params

    const problems = await Problem.findAll({
      where: {
        deliveryId: id
      }
    })

    if (!id || !problems) {
      return res.status(400).json({ message: 'Problem not found' })
    }

    return res.json({
      message: `Showing all problems for Delivery ${id}`,
      problems
    })
  }

  async store (req: Request, res: Response): Promise<Response> {
    const schemaParams = Yup.object().shape({
      id: Yup.number().required()
    })

    if (!(await schemaParams.isValid(req.params))) {
      return res
        .status(400)
        .json({ message: 'DeliveryId needs to be a number' })
    }

    const { id } = req.params

    const delivery = await Delivery.findByPk(id)

    if (!id || !delivery) {
      return res.status(400).json({ message: 'Delivery not found' })
    }

    if (!delivery.startDate) {
      return res.status(400).json({ message: 'Delivery not initiated' })
    }

    if (delivery.endDate) {
      return res.status(400).json({ message: 'Delivery already finished' })
    }

    const schemaBody = Yup.object().shape({
      description: Yup.string().required()
    })

    if (!(await schemaBody.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'Description is required and needs to be a string' })
    }

    const { description } = req.body

    const problem = await Problem.create({
      description,
      deliveryId: id
    })

    return res.json({
      message: 'Problem created successfuly',
      problem: {
        id: problem.id,
        description,
        deliveryId: problem.deliveryId
      }
    })
  }
}

export default new DeliveryProblemController()
