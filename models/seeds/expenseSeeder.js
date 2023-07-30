const db = require('../../config/mongoose')
const Expense = require('../expense')
const Category = require('../category')

// require data
const record = require('./record.json')
const category = require('./category.json')

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
