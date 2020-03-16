import { Sequelize } from 'sequelize'

import User from '../app/models/User'
import Recipient from '../app/models/Recipient'
import File from '../app/models/File'

import dbConfig from '../config/database'

const models = [User, Recipient, File]

class Database {
  private connection: Sequelize

  constructor () {
    this.init()
  }

  init (): void {
    const { define, host } = dbConfig

    this.connection = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      { define, dialect: 'postgres', host }
    )

    models.map(model => model.initialize(this.connection))
  }
}

export default new Database()
