import Delivery from './Delivery'

export default interface Problems {
  id: number
  deliveryId: number
  delivery: Delivery
  description: string
}
