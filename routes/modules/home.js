const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

// render index page
router.get('/', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  Expense.find({ userId })
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

router.post('/filter', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  const selectedCategory = req.body.category
  if (!selectedCategory) {
    return res.redirect(`/`)
  }
  Category.findOne({ name: selectedCategory })
    .lean()
    .then(category => {
      const categoryId = category._id
      return Expense.find({ categoryId, userId })
       // .populate('categoryId')
        .lean()
        .sort({ date: -1, _id: -1 })
        .then(expenses => 
          expenses.map(expense => {
            console.log(expense)
          expense.date = new Date(expense.date).toISOString().slice(0, 10)
          return expense
        }))
        .then(expense => {
          expense.forEach(expense => totalAmount += expense.amount)
          res.render('index', { expense, selectedCategory, totalAmount })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

module.exports = router