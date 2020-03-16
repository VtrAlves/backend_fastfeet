import Sequelize, { Model } from 'sequelize'

import FileInterface from '../interfaces/File'

class File extends Model implements FileInterface {
  public id: number
  public name: string
  public path: string
  public createdAt: Date
  public updatedAt: Date

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.STRING,
          get (): string {
            return `${process.env.APP_URL}/files/${this.path}`
          }
        }
      },
      {
        sequelize,
        modelName: 'file'
      }
    )
  }
}

export default File
