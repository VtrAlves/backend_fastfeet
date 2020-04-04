export default interface Delivery {
  id: number
  recipientId: number
  deliverymanId: number
  signatureId: number
  product: string
  startDate: Date
  endDate: Date
  cancelledAt: Date
  createdAt: Date
  updatedAt: Date
}
