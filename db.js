const sql = require('mssql')
const path = require('path')
require('dotenv').config()

// specify sql file location
const sqlPath = path.join(__dirname, 'sql')

// for server, need to put the fully qualified domain name to connect in OpenShift
// can ping the server in cmd to check the full domain name
const configProd535 = {
    user: process.env.PROD535_USERNAME,
    password: process.env.PROD535_PASSWORD,
    server: 'fsmssprod535.imfs.micron.com',
    database: 'RDA_IMP_INFO',
    options: {
        enableArithAbort: true, // needed to silence tedious
    }
}

// connect to your database Prod535
const poolProd535 = new sql.ConnectionPool(configProd535)
  .connect()
  .then(pool => {
    console.log('Connected to ' + configProd535.server)
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

// export sql connection
module.exports = {
  sql, poolProd535, sqlPath
}