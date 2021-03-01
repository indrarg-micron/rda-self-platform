const moment = require('moment-timezone')
const cron = require('node-cron')
const fs = require('fs')
const { poolProd535, sqlPath } = require('./db')

// set default timezone to SGT and set default format
moment.tz.setDefault('Asia/Singapore')
moment.defaultFormat = 'MMM D, YYYY h:mm a z'

// last 4 Micron Financial Quarters (FQs) and next 1 FQ ~more or less~
// accurate up to month (too troublesome to be accurate up to WW)
let fyq = {
  quarters: [], 
  currQ: '', 
  nextQ: '', 
  quarterList: '', 
  quarterColumn: ''
}

function getQuarters() {
  fyq.quarters = [ -7, -4, -1, 2, 5 ].map(i => 
    moment().subtract(i, 'M').format('[FY]YY[Q]Q')
  )
  fyq.currQ = fyq.quarters[1]
  fyq.nextQ = fyq.quarters[0]
  fyq.quarterList = `('${fyq.quarters[4]}', '${fyq.quarters[3]}', '${fyq.quarters[2]}', '${fyq.quarters[1]}')`
  fyq.quarterColumn = `([${fyq.quarters[4]}], [${fyq.quarters[3]}], [${fyq.quarters[2]}], [${fyq.quarters[1]}])`
}

// get quarters when the app start
getQuarters()

// update quarters every 1st day of month of FQ, 00:01 AM SGT
cron.schedule('1 0 1 Mar,Jun,Sep,Dec *', () => {
  getQuarters()
}, {
  scheduled: true,
  timezone: "Asia/Singapore"
})

// port every 1st day of month of FQ, 00:05 AM SGT
cron.schedule('5 0 1 Mar,Jun,Sep,Dec *', async () => {
  let timestamp = moment().format()
  console.log(`Porting ${fyq.currQ} score data to ${fyq.nextQ} on ${timestamp}`)

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


// export
module.exports = {
  moment, fyq
}