const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Expense = require('../expense')
const Category = require('../category')
const User = require('../user')

// require data
const record = require('./record.json')
const category = require('./category.json')

// seed user data
const SEED_USER = {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}

const transferCategoryId = () => {
  let transferedRecord = []
  record.map(expense => {
    let categoryId = expense.categoryId
    Category.findOne({ form_id: categoryId })
      .then(catId => {
        categoryId = catId._id
        return categoryId
      })
      .then(categoryId => {
        const { name, date, amount } = expense
        transferedRecord.push({
          name, date, amount, categoryId
        })
        console.log(transferedRecord)
        return transferedRecord
      })
      .catch(err => console.log(err))
  })
  return transferedRecord
}


db.once('open', () => {
  console.log('MongoDB connected!')
  // create category
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
    const userId = user._id  
    // 從 Category 資料庫中找出 _id
    return Promise.all (Array.from(
      { length: 5 },
      (_, i) => {
        return transferCategoryId
      }
    ))
      .then(expenses => {
        expenses.map(expense => {
          const { name, date, amount, categoryId } = expense
          Expense.create({ name, date, amount, categoryId, userId })
        })
      })
      .catch(err => console.log(err))  
  }) 
  .then(() => {
    console.log('expense seed created.')
    process.exit()
  })
})
