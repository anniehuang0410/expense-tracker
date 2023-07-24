const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const PORT = 3000

// 僅在非正式環境使用 dotenv
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
} )
db.once('open', () => {
  console.log('MongoDB connected!')
})

app.get('/', (req, res) => {
  res.send('Initialization')
})

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})