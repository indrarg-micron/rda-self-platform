const express = require('express')
const router = express.Router()
const gaussian = require('gaussian')
const fs = require('fs')
const path = require('path')
const { poolProd535, sqlPath } = require('../db')
const { moment, fyq } = require('../misc')

// GET home page
router.get('/', function(req, res, next) {
  let params = {
    title: 'Home',
    active: { home: true },
    quarters: fyq.quarters,
    currQ: fyq.currQ,
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

// indiv
router.post('/api/indiv-table', async (req, res, next) => {
  let username = res.locals.user.name

  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let user = `'${username}'`
    let tablename = body.tablename

    let query = fs.readFileSync(path.join(sqlPath, 'home-indiv-table.sql')).toString()
    query = query.replace('###YOUR_USERNAME_HERE###', user)
    query = query.replace('###FY_QUARTER_LIST_HERE###', fyq.quarterList)
    query = query.replace('###FY_QUARTER_COLUMN_HERE###', fyq.quarterColumn)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    let data = result.recordset
    let keys = Object.keys(data[0])
    let params = {
      tablename: tablename,
      data: data,
      keys: keys,
      skip: ['section', 'level', 'category', 'item'],
      layout: false
    }
    res.render('table-template', params)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.post('/api/indiv-chart', async (req, res, next) => {
  let username = res.locals.user.name

  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let filter = `AND e.[username] = '${username}'
                  AND s.[fy_quarter] IN ${fyq.quarterList}`

    let query = fs.readFileSync(path.join(sqlPath, 'home-sum-score.sql')).toString()
    query = query.replace('###ADDITIONAL_FILTER_HERE###', filter)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    let data = result.recordset
    let xValues = [], yValues = []
    data.forEach( a => {
      xValues.push(a.fy_quarter)
      yValues.push(a.total_score)
    })

    let final = {
      xValues: xValues,
      yValues: yValues
    }
    res.send(final)

  } catch (err) {
    res.status(500).send(err.message)
  }
})

// section
router.post('/api/section-table', async (req, res, next) => {
  try {
    if (!res.locals.elevation) {
      return res.status(403).send('No Access')
    }

    const body = JSON.parse(JSON.stringify(req.body))
    let section = body.section
    let tablename = body.tablename
    let quarter = body.quarter || fyq.currQ

    let query = fs.readFileSync(path.join(sqlPath, 'home-section-table.sql')).toString()
    query = query.replace('###CURRENT_QUARTER_HERE###', quarter)
    query = query.replace('###YOUR_SECTION_HERE###', section)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    let data = result.recordset
    let keys = Object.keys(data[0])
    let params = {
      tablename: tablename,
      data: data,
      keys: keys,
      skip: ['section', 'level', 'category', 'item'],
      layout: false
    }
    res.render('table-template', params)
  
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.post('/api/section-chart', async (req, res, next) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))
    let section = body.section
    let quarter = body.quarter || fyq.currQ

    let filter = `AND e.[section] = '${section}'
                  AND s.[fy_quarter] = '${quarter}'
                  AND e.[gjs] LIKE 'T%'`

    let query = fs.readFileSync(path.join(sqlPath, 'home-sum-score.sql')).toString()
    query = query.replace('###ADDITIONAL_FILTER_HERE###', filter)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    let data = result.recordset
    let rawByGjs = {'TA': [], 'T1': [], 'T2': [], 'T3': [], 'T4': []}
    let final = []

    data.forEach(d => {
      rawByGjs[d.gjs].push(d.total_score)
      rawByGjs[d.gjs].sort()
    })

    /*
    // for test purposes
    rawByGjs = {
      'TA': [3.5, 4, 5, 5.5, 7],
      'T1': [2, 4, 5, 7.5, 7.5, 9.5],
      'T2': [1, 3, 4.5, 6, 6, 6, 7.25, 7.5, 7.5, 7.5, 8, 10, 10, 10.5, 10.5, 10.5, 10.75, 10.75, 11, 11.5, 12.75],
      'T3': [8.5, 10.5, 10.75, 13, 13.5, 13.5, 15.5],
      'T4': []
    }
    */

    // return error if all data is empty
    if ( checkProp(rawByGjs) ) {
      throw new TypeError('No Data')
    }

    // calculate the normal distribution
    for (const gjs in rawByGjs) {
      let arrNormDist = []
      if (rawByGjs[gjs].length) {
        const mean = calcMean(rawByGjs[gjs])
        const stdDev = calcStdDev(rawByGjs[gjs])
        let dist = gaussian(mean, Math.pow(stdDev, 2)) // gaussian(mean, variance)
        rawByGjs[gjs].forEach(x => {
          let y = dist.pdf(x)
          arrNormDist.push([x, y])
        })
      }
      final.push({name: gjs, data: arrNormDist})
    }

    res.send(final)

  } catch (err) {
    res.status(500).send(err.message)
  }
})

// mean and std dev calculator, norm dist use gaussian module
function calcMean(arr) {
  const n = arr.length
  const mean = arr.reduce((a, b) => a + b) / n
  return mean
}

// std dev with population, match excel stdev.p
// with population, use n-1 for stdDev formula, no pop (i.e. stdev.s) use n only
function calcStdDev(arr) {
  const n = arr.length
  if ( n == 1 ) { return 0 } // return 0 if array consists of only 1 value to trigger error in norm dist
  const mean = arr.reduce((a, b) => a + b) / n
  const stdDev = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1) )
  return stdDev
}


// check if all attributes of an object are all null or empty string
function checkProp(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != "")
      { return false }
  }
  return true
}

module.exports = router
