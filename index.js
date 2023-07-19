if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')

const indexRouter = require('./routes/index')
const itemsRouter = require('./routes/items')
const authRouter = require('./routes/auth')

const User = require('./models/user')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => User.find(user => user.email === email),
    id => User.find(user => user.id === id)
)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewurlParser: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to db'))

app.use('/', indexRouter)
app.use('/items', itemsRouter)
app.use('/auth', authRouter)

app.listen(process.env.PORT || 3000)