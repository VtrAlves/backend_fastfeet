import Sequelize, { Model } from 'sequelize'

import ProblemsInterface from '../interfaces/Problems'
import DeliveryInterface from '../interfaces/Delivery'
import ModelsInterface from '../interfaces/Models'

class Problems extends Model implements ProblemsInterface {
  public id: number
  public deliveryId: number
  public delivery: DeliveryInterface
  public description: string

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        description: Sequelize.TEXT
      },
      {
        sequelize,
        modelName: 'delivery_problems'
      }
    )
  }

  static associate (models: ModelsInterface): void {
    this.belongsTo(models.deliveries, {
      foreignKey: 'deliveryId',
      as: 'delivery'
    })
  }
}

export default Problems
