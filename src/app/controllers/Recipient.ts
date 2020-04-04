import { Request, Response } from 'express'
import * as Yup from 'yup'

import Recipient from '../models/Recipient'

class RecipientController {
  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      cep: Yup.string().length(8)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    try {
      const {
        id,
        name,
        address,
        number,
        complement,
        city,
        state,
        cep
      } = await Recipient.create(req.body)

      return res.status(200).json({
        message: 'Recipient created successfuly',
        data: { id, name, address, number, complement, city, state, cep }
      })
    } catch (e) {
      return res.status(500).json({ message: e })
    }
  }

  async index (req: Request, res: Response): Promise<Response> {
    const recipients = await Recipient.findAll({
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
    })

    return res.json({ message: 'Showing all recipients', recipients })
  }
}

export default new RecipientController()
