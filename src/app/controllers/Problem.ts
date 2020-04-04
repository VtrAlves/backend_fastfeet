import { Request, Response } from 'express'

import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Problems from '../models/Problem'
import Recipient from '../models/Recipient'

class ProblemsController {
  async index (req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query

    const problems = await Problems.findAll({
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
}

export default new ProblemsController()
