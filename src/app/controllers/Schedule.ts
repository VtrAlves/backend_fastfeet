import { Request, Response } from 'express'
import * as Yup from 'yup'

import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'

class ScheduleController {
  async index (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    })

    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ message: 'Deliveryman needs to be a number' })
    }

    const { id } = req.params

    const deliveryman = await Deliveryman.findByPk(id)

    if (!id || !deliveryman) {
      return res.status(400).json({ message: 'Deliveryman not found' })
    }

    const { page = 1 } = req.query

    const deliveries = await Delivery.findAll({
      where: { cancelledAt: null, deliverymanId: id },
      limit: 30,
      offset: (page - 1) * 20,
      order: [
        ['startDate', 'DESC'],
        ['createdAt', 'DESC']
      ],
      attributes: ['id', 'product', 'startDate', 'createdAt', 'endDate'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'address',
            'number',
            'complement',
            'city',
            'state',
            'cep'
          ]
        }
      ]
    })

    const count = await Delivery.count({
      where: { cancelledAt: null, deliverymanId: id }
    })

    res.header({ 'x-total-count': count })
    return res.json({
      message: `Showing all deliveries for ${deliveryman.name}`,
      deliveries
    })
  }

  async update (req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'in development' })
  }
}

export default new ScheduleController()
