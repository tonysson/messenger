const express = require('express')
const connect = require('./config/database')
const dotenv = require('dotenv')
const authRouter = require('./routes/authRoutes')
const messengerRouter = require('./routes/messengerRoutes');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
dotenv.config({
    path : 'server/config/config.env'
})

const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/messenger', authRouter)
app.use('/api/messenger', messengerRouter);


app.listen(PORT , () => {
    connect()
    console.log(`server running on port ${PORT}`);
})