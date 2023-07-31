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
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      console.log('User already exists.')
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

module.exports = router