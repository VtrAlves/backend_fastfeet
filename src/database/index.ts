import { Sequelize } from 'sequelize'

import Deliveryman from '../app/models/Deliveryman'
import File from '../app/models/File'
import User from '../app/models/User'
import Recipient from '../app/models/Recipient'

import dbConfig from '../config/database'

const models = [Deliveryman, User, Recipient, File]

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
    models.map(
      model => model.associate && model.associate(this.connection.models)
    )
  }
}

export default new Database()
