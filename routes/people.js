const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')

router.get('/', async (req, res, next) => {
  try {
    let query = fs.readFileSync(path.join(sqlPath, 'people-view.sql')).toString()

    if (res.locals.user.permission == 'admin') {
      var content = ""
    } else if (res.locals.user.permission == 'section'){
      var content = "WHERE p.[section] = '" + res.locals.user.section + "'"
    }
    query = query.replace('###PERMISSION_FILTER_HERE###', content)

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
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  let username = res.locals.ntlm.UserName.toLowerCase()

  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'people-add-edit.sql')).toString()
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
  let username = res.locals.ntlm.UserName.toLowerCase()

  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.valueString

    let query = fs.readFileSync(path.join(sqlPath, 'people-delete.sql')).toString()
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
