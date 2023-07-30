// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')
const expense = require('./modules/expense')
const user = require('./modules/user')

// 使用路由模組
router.use('/', home)
router.use('/expenses', expense)
router.use('/users', user)

// 匯出路由器
module.exports = router