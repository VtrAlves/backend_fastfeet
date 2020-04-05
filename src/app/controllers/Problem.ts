import { Request, Response } from 'express'

import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Problem from '../models/Problem'
import Recipient from '../models/Recipient'

class ProblemsController {
  async index (req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query

    const problems = await Problem.findAll({
      limit: 30,
      offset: (page - 1) * 20,
      attributes: ['id', 'description'],
      order: [['id', 'DESC']],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'startDate', 'endDate', 'createdAt'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email']
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    return res.json({ message: 'Showing all problems', problems })
  }

  async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const problem = await Problem.findByPk(id)

    if (!id || !problem) {
      return res.json({ message: 'Problem not found' })
    }

    const delivery = await Delivery.findByPk(problem.deliveryId)

    if (delivery.endDate) {
      return res.json({ message: 'Delivery already finished' })
    }

    delivery.update({ cancelledAt: new Date() })

    return res.json({ message: `Delivery ${problem.deliveryId}`, delivery })
  }
}

export default new ProblemsController()
