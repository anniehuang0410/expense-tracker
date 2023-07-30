const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') // 載入 handlebars
const methodOverride = require('method-override') // 載入 method-override

const routes = require('./routes') // 引入路由模組

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
app.use(routes) // 使用路由

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})