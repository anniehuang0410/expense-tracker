const mongoose = require('mongoose') // 載入 mongoose

// 僅在非正式環境使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} 
// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }) 

// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB error.')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

module.exports = db