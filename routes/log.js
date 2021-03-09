const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')
const { moment } = require('../misc')

router.get('/', async (req, res, next) => {
  let today = moment().format('YYYY-MM-DD')
  let lastMonth = moment().subtract(1, 'M').format('YYYY-MM-DD')
  
  // get date from url query
  let fromDate = req.query.from || lastMonth
  let toDate = req.query.to || today

  try {
    let query = fs.readFileSync(path.join(sqlPath, 'log-view.sql')).toString()

    query = query.replace('###FROM_WHEN###', fromDate)
    query = query.replace('###TO_WHEN###', toDate)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      

    result.recordset.forEach(e => {
      // server time already in UTC+8, but moment does not know this
      e.timestamp = moment.utc(e.timestamp).format('YYYY-MM-DD HH:mm')
    })

    let params = {
      title: 'Log',
      data: result.recordset,
      from: fromDate,
      to: toDate,
      active: { log: true }
    }

    res.render('log', params)
  
  } catch (err) {
    next(err)
  }
})

module.exports = router
