const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Initialization')
})

app.listen(PORT, () => {
  console.log(`This app is running on http://localhost:${PORT}`)
})