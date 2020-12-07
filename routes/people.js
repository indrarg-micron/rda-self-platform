const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')

router.get('/', async (req, res) => {
  try {
    let query = fs.readFileSync(path.join(sqlPath, 'people-view.sql')).toString()
    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      

    let params = {
      title: 'People',
      data: result.recordset,
      active: { people: true }
    }

    res.render('people', params)
  
  } catch (err) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error', { title: 'Error'})
  }
})

module.exports = router
