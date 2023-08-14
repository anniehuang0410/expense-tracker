const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Expense = require('../expense')
const Category = require('../category')
const User = require('../user')

// require data
const recordList = require('./record.json')
const category = require('./category.json')

// seed user data
const SEED_USER = {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}

db.once('open', () => {
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
      return Promise.all(Array.from(
        { length: recordList.length },
        (_, i) => {
          return Category.findOne({ name: recordList[i].category })
            .lean()
            .then(category => {
              recordList[i].categoryId = category._id
              recordList[i].userId = userId
              return recordList[i]
            })
            .catch(error => console.log(error))
        }
      ))
        .then(() => Expense.create(recordList))
        .catch(error => console.log(error))
    })
    .then(() => {
      console.log('expense seeds created')
      process.exit()
    })
})
