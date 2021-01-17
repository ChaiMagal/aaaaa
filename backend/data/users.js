import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('12345', 10),
    isAdmin: true,
  },
  {
    name: 'Mr John',
    email: 'John@example.com',
    password: bcrypt.hashSync('12345', 10),
  },
  {
    name: 'Ms Jane',
    email: 'Melisa@example.com',
    password: bcrypt.hashSync('12345', 10),
  },
]
export default users
