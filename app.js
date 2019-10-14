const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const path = require('path')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

const session = require('express-session')

app.use(session({
    secret: 'kanatafe',
    resave: false,
    saveUninitialized: true,
}))

var pgp = require('pg-promise')();
var connectionString = 'postgres://goxmlxcn:qjBmiizJBr3AAvyO6fWkFZWZLX8X-Ok-@raja.db.elephantsql.com:5432/goxmlxcn';
global.db = pgp(connectionString)

app.use(express.urlencoded())
app.use('/',indexRouter)
app.use('/users',userRouter)
app.use(express.static('images'))
app.use(express.static('css'))
const VIEWS_PATH = path.join(__dirname,'/views')

app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine', 'mustache')

app.listen(3000,() => {console.log('Server is running...')})