const db = require('../../config/mongoose')
const Category = require('../category')

// require data
const record = require('./record.json')
const category = require('./category.json')


db.once('open', () => {
  const categoryList = []  

  Promise.all (category.map(cat => {
    const { form_id, name, icon } = cat
    return Category.create({ form_id, name, icon })
  }))
    
      .then(() => {
        console.log('category seeds created.')
        process.exit()
      })
  
})