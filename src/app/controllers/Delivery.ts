import { Request, Response } from 'express'
import * as Yup from 'yup'
import { parseISO, isBefore, isAfter, set } from 'date-fns'

import Mail from '../../lib/Mail'

import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'

class DeliveryController {
  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      recipientId: Yup.number().required(),
      deliverymanId: Yup.number().required(),
      signatureId: Yup.number().required(),
      product: Yup.string().required(),
      date: Yup.date().notRequired()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { date, deliverymanId, recipientId, signatureId, product } = req.body

    const startDate = parseISO(date)

    const beforeDate = set(startDate, { hours: 8, minutes: 0, seconds: 0 })
    const afterDate = set(startDate, { hours: 18, minutes: 0, seconds: 0 })

    // Verifica se está dentro do horário indicado
    if (isBefore(startDate, beforeDate) || isAfter(startDate, afterDate)) {
      return res
        .status(400)
        .json({ message: "Hour isn't avaliable for deliveries" })
    }

    const delivery = await Delivery.create({
      date,
      deliverymanId,
      recipientId,
      signatureId,
      product,
      startDate
    })

    const { deliveryman, recipient, id } = await Delivery.findByPk(
      delivery.id,
      {
        attributes: ['id', 'product'],
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email']
          },
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
      }
    )

    let address: string

    if (recipient.complement) {
      address = `${recipient.address}, ${recipient.number} - ${recipient.complement} - ${recipient.city} - ${recipient.state}, ${recipient.cep}`
    } else {
      address = `${recipient.address}, ${recipient.number} - ${recipient.city} - ${recipient.state}, ${recipient.cep}`
    }

    try {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Nova Entrega',
        template: 'newDelivery',
        context: {
          id,
          deliveryman: deliveryman.name,
          recipient: recipient.name,
          address,
          product
        }
      })
    } catch (err) {
      return res.json(err)
    }

    return res.json({ message: 'Delivery Created successfuly!', delivery })
  }

  async index (req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query

    const deliveries = await Delivery.findAll({
      where: { cancelledAt: null },
      limit: 30,
      offset: (page - 1) * 20,
      order: [
        ['startDate', 'DESC'],
        ['createdAt', 'DESC']
      ],
      attributes: ['id', 'product', 'startDate', 'createdAt', 'endDate'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email']
        },
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
      where: { cancelledAt: null }
    })

    res.header({ 'x-total-count': count })
    return res.json({ message: 'Showing all deliveries', deliveries })
  }

  async update (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      product: Yup.string(),
      deliveryman: Yup.number(),
      recipientId: Yup.number()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { id } = req.params

    const delivery = await Delivery.findByPk(id)

    if (!id || !delivery) {
      return res.status(400).json({ message: 'ID not found' })
    }

    const newData = await delivery.update(req.body)

    return res.json({ message: `Delivery ${id} Updated Successfuly`, newData })
  }

  async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const delivery = await Delivery.findByPk(id)

    if (!id || !delivery) {
      return res.status(400).json({ message: 'Delivery not found' })
    }
    try {
      await delivery.destroy()
    } catch (err) {
      return res.json({ err })
    }

    return res.status(204).send()
  }
}

export default new DeliveryController()
