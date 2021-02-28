const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const hbs = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const logger = require('morgan')
const ntlm = require('express-ntlm')
const moment = require('moment-timezone')
const cron = require('node-cron')
const fs = require('fs')
const { poolProd535, sqlPath } = require('./db')

const indexRouter = require('./routes/index')
const peopleRouter = require('./routes/people')
const checklistRouter = require('./routes/checklist')
const scoreRouter = require('./routes/score')

const app = express()
app.use( ntlm() ) // to get windows username

// set default timezone to SGT and set default format
moment.tz.setDefault('Asia/Singapore')
moment.defaultFormat = 'MMM D, YYYY h:mm a z'

// port every 1st day of month of FQ, 00:05 AM SGT
cron.schedule('5 0 1 Mar,Jun,Sep,Dec *', async () => {
  let currQ = moment().add(4, 'M').format('[FY]YY[Q]Q')
  let nextQ = moment().add(7, 'M').format('[FY]YY[Q]Q')
  let timestamp = moment().format()
  console.log(`Porting ${currQ} score data to ${nextQ} on ${timestamp}`)

  try {
    let query = fs.readFileSync(path.join(sqlPath, 'port-to-next-q.sql')).toString()
    query = query.replace('###NEXT_QUARTER###', nextQ)
    query = query.replace('###CURRENT_QUARTER###', currQ)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    console.log(result.rowsAffected.pop() + ' rows copied to ' + nextQ)
  
  } catch (err) {
    console.log(err.message)
  }
}, {
  scheduled: true,
  timezone: "Asia/Singapore"
})

// view engine setup, with helpers
// app.set('views', path.join(__dirname, 'views'))
app.engine(
  "hbs",
  hbs({
    helpers: helpers,
    partialsDir: ["views/partials"],
    extname: ".hbs",
    layoutsDir: "views",
    defaultLayout: "layout"
  })
)
app.set('view engine', 'hbs')

app.use(logger('dev')) // logger for dev purposes
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// set up routes
app.use('/', authHome, indexRouter)
app.use('/people', authInner, peopleRouter)
app.use('/checklist', authInner, checklistRouter)
app.use('/score', authInner, scoreRouter)

// pseudo-authentication process to root (all routes)
async function authHome(req, res, next) {
  let username = res.locals.ntlm.UserName.toLowerCase()

  try {
    let query = fs.readFileSync(path.join(sqlPath, 'auth-home.sql')).toString()
    query = query.replace('###WHO_ARE_YOU###', `'${username}'`)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    if (result.rowsAffected == 0) {
      // set locals
      res.locals.message = 'Forbidden'
      res.locals.error = {stack: 'You are not authorized to view this page.\nPlease contact the site administrator.'}

      // render the error page
      res.status(403)
      return res.render('error', { title: 'Error'})

    } else {
      // set locals of user
      res.locals.user = {
        name: result.recordset[0].username,
        section: result.recordset[0].section,
        gjs: result.recordset[0].gjs,
        permission: result.recordset[0].permission
      }

      if (res.locals.user.permission == 'admin') {
        res.locals.elevation = { admin: true }
      } else if (res.locals.user.permission == 'section') {
        res.locals.elevation = { section: true }
      }

      next()
    }
  
  } catch (err) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    return res.render('error', { title: 'Error'})
  }

  
}

// pseudo-authentication process for inner links, after authHome has been performed
async function authInner(req, res, next) {
  try {
    if (res.locals.user.permission != 'admin' && res.locals.user.permission != 'section') {
      return res.redirect('/')
    }

    next()

  } catch (err) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    return res.render('error', { title: 'Error'})
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { title: 'Error'})
})

module.exports = app
