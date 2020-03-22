import { ModelCtor, Model } from 'sequelize'

export default interface Imodels {
  [key: string]: ModelCtor<Model>
}
