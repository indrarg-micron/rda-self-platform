const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const hbs = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const logger = require('morgan')
const ntlm = require('express-ntlm')
const fs = require('fs')
const { poolProd535, sqlPath } = require('./db')

const indexRouter = require('./routes/index')
const peopleRouter = require('./routes/people')
const checklistRouter = require('./routes/checklist')
const scoreRouter = require('./routes/score')
const logRouter = require('./routes/log')

const app = express()
app.use( ntlm() ) // to get windows username

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
app.use('/log', authInner, logRouter)

// pseudo-authentication process to root (all routes)
async function authHome(req, res, next) {
  try {
    let username = req.ntlm.UserName.toLowerCase()

    let query = fs.readFileSync(path.join(sqlPath, 'auth-home.sql')).toString()
    query = query.replace('###WHO_ARE_YOU###', `'${username}'`)

    const pool = await poolProd535
    const result = await pool.request()
        .query(query)      
    
    if (result.rowsAffected == 0) {
      throw new createError(403, `${username} is not authorized to view this page`)

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
    next(err)
  }

  
}

// pseudo-authentication process for inner links, after authHome has been performed
async function authInner(req, res, next) {
  try {
    let elevation = await res.locals.elevation
    
    if (!elevation) {
      return res.redirect('/')
    }

    next()

  } catch (err) {
    next(err)
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler (because it has 4 arguments)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { title: 'Error' })
})

module.exports = app
