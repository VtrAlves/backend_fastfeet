import Sequelize, { Model } from 'sequelize'

import DeliverymanInterface from '../interfaces/Deliveryman'
import ModelsInterface from '../interfaces/Models'

class Deliveryman extends Model implements DeliverymanInterface {
  public id: number
  public name: string
  public avatarId: number
  public email: string
  public createdAt: Date
  public updatedAt: Date

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING
      },
      {
        sequelize,
        modelName: 'deliveryman'
      }
    )
  }

  static associate (models: ModelsInterface): void {
    this.belongsTo(models.file, { foreignKey: 'avatarId', as: 'avatar' })
  }
}

export default Deliveryman
