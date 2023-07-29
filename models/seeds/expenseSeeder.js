const mongoose = require('mongoose')
const Expense = require('../expense')
const Category = require('../category')

// require data
const record = require('./record.json')
const category = require('./category.json')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  // create category
  Promise.all(category.map(cat => {
    const { form_id, name, icon } = cat
    return Category.create({ form_id, name, icon })
  }))
  .then(() => {
    // 從 Category 資料庫中找出 _id
    record.map(expense => {
      let categoryId = expense.categoryId
      Promise.all (
       Category.findOne({ form_id: categoryId })
          .lean()
          .then(catId => {
            categoryId = catId._id
            return categoryId
          })
          .then(categoryId => {
            const { name, date, amount } = expense
            return Expense.create({ name, date, amount, categoryId })
          })
      .then(() => {
        console.log('done!')
        process.exit()
      })
      )
      .catch(err => console.log(err))
    })
  }) 
})
