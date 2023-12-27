require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const { getTokenFrom, errorHandler, userExtractor } = require('./utils/middleware')





mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)

}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


module.exports = app