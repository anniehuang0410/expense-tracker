const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')

// render login page
router.get('/login', (req, res) => {
  res.render('login')
})

// render register page
router.get('/register', (req, res) => {
  res.render('register')
})
// submit registration form
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      res.render('register', { name, email, password, confirmPassword })
    } else {
      // 如果還沒註冊：寫入資料庫
      return User.create({ name, email, password})
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    }
  })
    .catch(err => console.log(err))
})

// login router
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// logout router
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router