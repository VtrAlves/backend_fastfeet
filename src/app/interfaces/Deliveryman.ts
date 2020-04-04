import FileInterface from './File'

export default interface Deliveryman {
  id: number
  name: string
  avatarId: number
  avatar?: FileInterface
  email: string
  createdAt: Date
  updatedAt: Date
}
