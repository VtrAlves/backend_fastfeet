export default interface User {
  id: number
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}
