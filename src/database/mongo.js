const { RESOLVER, Lifetime } = require('awilix')
const mongoose = require('mongoose')

const database = () => {
  const { DB_HOST, DB_DATABASE, DB_USER, DB_PASS } = process.env
  const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_DATABASE}?retryWrites=true&w=majority`
  mongoose.set('strictQuery', false)
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_PASS
  })

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    console.log('connected to MongoDB database!')
  })

  return mongoose
}

module.exports = database
database[RESOLVER] = {
  name: 'database',
  lifetime: Lifetime.SINGLETON
}
