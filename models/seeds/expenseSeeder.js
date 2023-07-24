const mongoose = require('mongoose')
const category = require('./category.json')
const Expense = require('../expense')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  for(let i = 0; i < 5; i++) {
    Expense.create({
      name: `"expense-${i}"`,
      date: Date(),
      categoryId: category[i].id
    })
  }
  console.log('done!')
})