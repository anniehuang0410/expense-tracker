// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')
const expense = require('./modules/expense')
const user = require('./modules/users')
const { authenticator } = require('../middleware/auth') // 引入 middleware

// 使用路由模組
router.use('/expenses', authenticator, expense) // 加入驗證程序
router.use('/users', user)
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router