const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

// render new page
router.get('/new', (req, res) => {
  return res.render('new')
})
// add new expenses
router.post('/', (req, res) => {
  let { name, date, categoryId, amount } = req.body
  Promise.all(
    categoryId = Category.findOne({ form_id: categoryId })
      .then(category => {
        categoryId = category._id
        return categoryId
      })
      .then(categoryId => {
        Expense.create({ name, date, categoryId, amount })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      })
  )
    .catch(err => console.log(err))
})

// render edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  let expenseDate = ''
  let categoryName = ''
  Expense.findById(id)
    .lean()
    .then(expense => {
      expenseDate = new Date(expense.date).toISOString().slice(0, 10)
      return expense
    })
    .then(expense => {
      const categoryId = expense.categoryId
      Category.findById(categoryId)
        .then(category => {
          categoryName = category.name
          return expense
        })
        .then(expense => res.render('edit', { expense, categoryName, expenseDate }))
        .catch(err => console.log(err))
    })
})
// save edit
router.put('/:id', (req, res) => {
  const _id = req.params.id
  let { name, date, amount, categoryId } = req.body
  Expense.findById(_id)
    .then(expense => {
      Category.findOne({ form_id: categoryId })
        .then(category => {
          categoryId = category._id
          return categoryId
        })
        .then(categoryId => {
          expense.categoryId = categoryId
          return categoryId
        })
        .catch(err => console.log(err))
      return expense.save()
    })
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.amount = amount
      return expense.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// delete 
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  return Expense.findById(_id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router