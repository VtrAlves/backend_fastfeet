import { Sequelize } from 'sequelize'

import Delivery from '../app/models/Delivery'
import Deliveryman from '../app/models/Deliveryman'
import File from '../app/models/File'
import Problem from '../app/models/Problem'
import Recipient from '../app/models/Recipient'
import User from '../app/models/User'

import dbConfig from '../config/database'

const models = [Deliveryman, Delivery, File, Problem, Recipient, User]

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
      (model: any) => model.associate && model.associate(this.connection.models)
    )
  }
}

export default new Database()
