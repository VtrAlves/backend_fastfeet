import { Request, Response } from 'express'
import * as Yup from 'yup'
import { parseISO, isBefore, isAfter, set } from 'date-fns'
import { pt } from 'date-fns/locale'

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

    const newDelivery = await Delivery.findByPk(delivery.id, {
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
    })

    const { deliveryman, recipient, id } = newDelivery

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

  async index (req: Request, res: Response): Promise<Response> {}
}

export default new DeliveryController()
