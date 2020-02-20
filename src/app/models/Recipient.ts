import Sequelize, { Model } from 'sequelize'

import RecipientInterface from '../interfaces/Recipient'

class Recipient extends Model implements RecipientInterface {
  public id: number
  public name: string
  public address: string
  public number: string
  public complement: string
  public city: string
  public state: string
  public cep: string
  public createdAt: Date
  public updatedAt: Date

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        cep: Sequelize.INTEGER
      },
      {
        sequelize,
        modelName: 'recipients'
      }
    )
  }
}

export default Recipient
