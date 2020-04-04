import { Request, Response } from 'express'
import {
  parseISO,
  isBefore,
  isAfter,
  isEqual,
  set,
  startOfDay,
  endOfDay
} from 'date-fns'
import { Op } from 'sequelize'
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

  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      startDate: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'startDate is required and needs to be a date'
      })
    }

    const { id } = req.params

    const delivery = await Delivery.findByPk(id)

    if (!id || !delivery) {
      return res.status(400).json({ message: 'Delivery not found' })
    }

    if (delivery.cancelledAt) {
      return res.status(400).json({ message: 'Delivery invalid' })
    }

    if (delivery.startDate) {
      return res.status(400).json({ message: 'Delivery already initiated' })
    }

    const { startDate } = req.body

    const date = parseISO(startDate)

    const count = await Delivery.count({
      where: {
        deliverymanId: delivery.deliverymanId,
        cancelledAt: null,
        startDate: {
          [Op.between]: [startOfDay(date), endOfDay(date)]
        }
      }
    })

    if (count > 5) {
      return res.status(400).json({
        message:
          "You've reached the delivery limit for today, please try again tomorrow"
      })
    }

    const beforeDate = set(date, { hours: 8, minutes: 0, seconds: 0 })
    const afterDate = set(date, { hours: 18, minutes: 0, seconds: 0 })

    // Verifica se está dentro do horário indicado
    if (isBefore(date, beforeDate) || isAfter(date, afterDate)) {
      return res
        .status(400)
        .json({ message: "Hour isn't avaliable for deliveries" })
    }

    await delivery.update({ startDate: date })

    return res.json({ message: 'Delivery Initiated', delivery })
  }

  async update (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      endDate: Yup.date().required(),
      signatureId: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'Validation fails'
      })
    }

    const { id } = req.params

    const delivery = await Delivery.findByPk(id)

    if (!id || !delivery) {
      return res.status(400).json({ message: 'Delivery not found' })
    }

    const { endDate, signatureId } = req.body

    if (!delivery.startDate) {
      return res.status(400).json({ message: 'Delivery not initiated' })
    }

    const date = parseISO(endDate)

    if (
      isBefore(date, delivery.startDate) ||
      isEqual(date, delivery.startDate)
    ) {
      return res.status(400).json({
        message: 'endDate needs to be after startDate',
        startDate: delivery.startDate
      })
    }

    await delivery.update({ endDate: date, signatureId })

    return res.json({ message: 'Delivery updated successfuly', delivery })
  }
}

export default new ScheduleController()
