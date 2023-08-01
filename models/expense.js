const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expenseSchema = new Schema ({
  name: {
    type: String, // 資料型別是字串
    //required: true
  },
  date: {
    type: Date, // 資料型別是日期
  },
  amount: {
    type: Number, // 資料型別是數字
    //required: true
  },
  userId: {  // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  // v1.不能自行新增版本
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    required: true
  }
})
module.exports = mongoose.model('Expense', expenseSchema)