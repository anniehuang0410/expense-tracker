const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

// render index page
router.get('/', (req, res) => {
  let totalAmount = 0
  Expense.find()
    .lean()
    .then(expenses => {
      expenses.map(expense => {
        expense.date = new Date(expense.date).toISOString().slice(0, 10)
        totalAmount += expense.amount // 總金額
      })
      return expenses
    })
    .then(expense => res.render('index', { expense, totalAmount }))
    .catch(err => console.log(err))
})

module.exports = router