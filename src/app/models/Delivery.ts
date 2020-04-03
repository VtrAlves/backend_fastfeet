import Sequelize, { Model } from 'sequelize'

import DeliveryInterface from '../interfaces/Delivery'
import ModelsInterface from '../interfaces/Models'

class Delivery extends Model implements DeliveryInterface {
  public id: number
  public recipientId: number
  public deliverymanId: number
  public signatureId: number
  public product: string
  public startDate: Date
  public endDate: Date
  public cancelledAt: Date
  public createdAt: Date
  public updatedAt: Date

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        product: Sequelize.STRING,
        startDate: Sequelize.DATE,
        endDate: Sequelize.DATE,
        cancelledAt: Sequelize.DATE
      },
      {
        sequelize,
        modelName: 'deliveries'
      }
    )
  }

  static associate (models: ModelsInterface): void {
    this.belongsTo(models.recipients, {
      foreignKey: 'recipientId',
      as: 'recipient'
    })
    this.belongsTo(models.deliverymans, {
      foreignKey: 'deliverymanId',
      as: 'deliveryman'
    })
    this.belongsTo(models.files, {
      foreignKey: 'signatureId',
      as: 'signature'
    })
  }
}

export default Delivery
