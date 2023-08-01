const express = require('express')
const exphbs = require('express-handlebars') // 載入 handlebars
const methodOverride = require('method-override') // 載入 method-override
const session = require('express-session') // 載入 cookie-session
const flash = require('connect-flash') // 載入 flash

const routes = require('./routes') // 引入路由模組

const usePassport = require('./config/passport')
require('./config/mongoose')

const Expense = require('./models/expense')
const Category = require('./models/category') 

const PORT = process.env.PORT

const app = express()

// set view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// cookie-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

app.use(routes) // 使用路由

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})