import { Request, Response } from 'express'
import * as Yup from 'yup'

import Problem from '../models/Problem'

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

    return res.json({ message: 'In development', problems })
  }
}

export default new DeliveryProblemController()
