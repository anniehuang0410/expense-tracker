const mongoose = require('mongoose')
const Expense = require('../expense')

// require data
const record = require('./record.json')
const category = require('./category.json')

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
  for(let i = 0; i < record.length; i++) {
    let { name, date, amount, categoryId } = record[i]
    //console.log(`name: ${name}`, `date: ${date}`)
    Expense.create({ name, date, amount, categoryId })
  }
    
    
  console.log('done!')
})