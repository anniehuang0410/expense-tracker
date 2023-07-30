const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') // 載入 handlebars
const methodOverride = require('method-override') // 載入 method-override

const Expense = require('./models/expense')
const Category = require('./models/category') 

const PORT = 3000

// 僅在非正式環境使用 dotenv
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
} )
db.once('open', () => {
  console.log('MongoDB connected!')
})

// set view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// render index page
app.get('/', (req, res) => {
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

// render new page
app.get('/expenses/new', (req, res) => {
  return res.render('new')
})
// add new expenses
app.post('/expenses', (req, res) => {
  let { name, date, categoryId, amount } = req.body
  Promise.all (
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
app.get('/expenses/:id/edit', (req, res) => {
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
app.put('/expenses/:id', (req, res) => {
  const id = req.params.id
  let { name, date, amount, categoryId } = req.body
  Expense.findById(id)
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
app.delete('/expenses/:id', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})