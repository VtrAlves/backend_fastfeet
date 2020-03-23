import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

import UserInterface from '../interfaces/User'

class User extends Model implements UserInterface {
  public id: number
  public name: string
  public email: string
  public passwordHash: string
  public password: string
  public administrator: boolean
  public createdAt: Date
  public updatedAt: Date

  static initialize (sequelize: Sequelize.Sequelize): void {
    this.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        passwordHash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        administrator: Sequelize.BOOLEAN
      },
      {
        hooks: {
          beforeSave: async (user): Promise<void> => {
            if (user.password) {
              user.passwordHash = await bcrypt.hash(user.password, 8)
            }
          }
        },
        sequelize,
        modelName: 'user'
      }
    )
  }

  chkPassword (password: string): boolean {
    return bcrypt.compare(password, this.passwordHash)
  }
}

export default User
