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
  const userId = req.user._id
  const { name, date, category, amount } = req.body
  // handling error messages
  const new_error = {}
  if (!name || !date || !category || !amount) {
    new_error.message = '請完成所有必填欄位！'
  }
  if (Object.keys(new_error).length) {
    return res.render('new', {
      new_error,
      name,
      date,
      category,
      amount
    })
  }
    return Category.findOne({ name: category })
      .lean() 
      .then(category => {
        req.body.categoryId = category._id
        req.body.userId = userId
        return req.body
      })
      .then(expense => {
        Expense.create(expense)
          
          .catch(err => console.log(err))
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
})

// render edit page
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Expense.findOne({ _id, userId })
    .populate('categoryId')
    .lean()
    .then(expense => {
      expense.date = new Date(expense.date).toISOString().slice(0, 10)
      return expense
    })
    .then(expense => res.render('edit', { expense }))
    .catch(error => console.log(error))
})
// save edit
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { category } = req.body
  return Category.findOne({ name: category })
    .lean()
    .then(category => {
      req.body.categoryId = category._id
      req.body.userId = userId
      return req.body
    })
    .then(expense => Expense.updateOne({ _id, userId }, expense))
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

// delete 
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Expense.findOne({ _id, userId })
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router