const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')
const { moment, fyq } = require('../misc')

router.get('/', async (req, res, next) => {
  let qFilter = req.query.q || fyq.nextQ

  try {
    let query = fs.readFileSync(path.join(sqlPath, 'score-view.sql')).toString()

    let content
    if (res.locals.user.permission == 'admin') {
      content = ""
    } else if (res.locals.user.permission == 'section'){
      content = "AND p.[section] = '" + res.locals.user.section + "'"
    }
    
    query = query.replace('###QUARTER_TO_LOOK_FOR###', qFilter)
    query = query.replace('###PERMISSION_FILTER_HERE###', content)
    
    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      

    let params = {
      title: 'Score',
      data: result.recordset,
      quarters: fyq.quarters,
      selQ: qFilter,
      active: { score: true }
    }

    res.render('score', params)
  
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    let username = await res.locals.ntlm.UserName.toLowerCase()

    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'score-add-edit-id.sql')).toString()
    query = query.replace('###INSERT_VALUE_STRING_HERE###', content)
    query = query.replace('###YOUR_USERNAME_HERE###', username)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.patch('/', async (req, res, next) => {
  try {
    let username = await res.locals.ntlm.UserName.toLowerCase()

    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'score-add-edit-content.sql')).toString()
    query = query.replace('###INSERT_VALUE_STRING_HERE###', content)
    query = query.replace('###YOUR_USERNAME_HERE###', username)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    let username = await res.locals.ntlm.UserName.toLowerCase()

    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'score-delete.sql')).toString()
    query = query.replace('###INSERT_VALUE_STRING_HERE###', content)
    query = query.replace('###YOUR_USERNAME_HERE###', username)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
