const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')

// set default timezone to SGT
moment.tz.setDefault('Asia/Singapore')

// last 4 Micron Financial Quarters (FQs) ~more or less~
// accurate up to month (too troublesome to be accurate up to WW)
let quarters = [ -4, -1, 2, 5 ].map(i => 
  moment().subtract(i, 'M').format('[FY]YY[Q]Q')
)

/* GET home page. */
router.get('/', function(req, res) {
  let params = {
    title: 'Home',
    active: { home: true },
    show: {}
  }

  if (res.locals.user.gjs[0] == 'T') {
    params.show = Object.assign(params.show, {indiv: true})
  }

  if (res.locals.user.permission == 'admin' || (res.locals.user.permission == 'section' && res.locals.user.section == 'Ops')) {
    params.show = Object.assign(params.show, {ops: true})
  }

  if (res.locals.user.permission == 'admin' || (res.locals.user.permission == 'section' && res.locals.user.section == 'Process')) {
    params.show = Object.assign(params.show, {proc: true})
  }

  if (res.locals.user.permission == 'admin' || (res.locals.user.permission == 'section' && res.locals.user.section == 'Equipment')) {
    params.show = Object.assign(params.show, {equip: true})
  }

  if (res.locals.user.permission == 'admin' || (res.locals.user.permission == 'section' && res.locals.user.section == 'Eng Proc')) {
    params.show = Object.assign(params.show, {engproc: true})
  }

  res.render('index', params)
})

router.post('/', async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let content = body.section

    let query = fs.readFileSync(path.join(sqlPath, 'home-overall.sql')).toString()
    query = query.replace('###YOUR_SECTION_HERE###', content)
    query = query.replace('###DESIRED_FQ_HERE###', quarters[0])

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    res.send(result)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
