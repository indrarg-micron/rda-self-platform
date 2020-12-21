const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')

router.get('/', async (req, res) => {
  try {
    let query = fs.readFileSync(path.join(sqlPath, 'checklist-view.sql')).toString()
    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      

    let params = {
      title: 'Checklist',
      data: result.recordset,
      active: { checklist: true }
    }

    res.render('checklist', params)
  
  } catch (err) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error', { title: 'Error'})
  }
})

router.post('/', async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'checklist-add-edit.sql')).toString()
    query = query.replace('###INSERT_VALUE_STRING_HERE###', content)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.delete('/', async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'checklist-delete.sql')).toString()
    query = query.replace('###INSERT_VALUE_STRING_HERE###', content)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
