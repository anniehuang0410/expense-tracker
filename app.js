const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') // 載入 handlebars
const Expense = require('./models/expense')

const PORT = 3000

// 僅在非正式環境使用 dotenv
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }) // 設定連線到 mongoDB

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
} )
db.once('open', () => {
  console.log('MongoDB connected!')
})

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
  const { name, date, categoryId, amount } = req.body
  return Expense.create({ name, date, categoryId, amount })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})