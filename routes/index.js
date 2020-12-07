const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  let params = {
    title: 'Home',
    active: { home: true }
  }
  res.render('index', params)
})

module.exports = router
