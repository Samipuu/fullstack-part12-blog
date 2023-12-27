const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const User = require('../models/user')

const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})

    const newUser = {
        username: "root",
        password: "salainen"
    }

    await api.post('/api/users').send(newUser)

})

test('create new user with unique username', async () => {
    const users = await api.get('/api/users')

    console.log(users.body.length)

    const newUser = {
        username: 'Sami',
        password: 'salasana'
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')

    console.log(usersAtEnd.body.length)

    expect(usersAtEnd.body).toHaveLength(users.body.length + 1)

    const usernames = usersAtEnd.body.map(u => u.username)
    expect(usernames).toContain(newUser.username)
})

test('create new user with invalid password fails', async () => {
    const users = await api.get('/api/users')

    const newUser = {
        username: 'testi',
        password: 'ss'
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await api.get('/api/users')

    expect(usersAtEnd.body).toHaveLength(users.body.length)
})

test('create new user with invalid username fails', async () => {
    const users = await api.get('/api/users')

    const newUser = {
        username: 'us',
        password: 'salasana'
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await api.get('/api/users')

    expect(usersAtEnd.body).toHaveLength(users.body.length)
})

test('create user with non unique username fails', async () => {
    const users = await api.get('/api/users')

    const newUser = {
        username: 'root',
        password: 'salasana'
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(500)

    const usersAtEnd = await api.get('/api/users')

    expect(usersAtEnd.body).toHaveLength(users.body.length)
})



afterAll(async () => {
    await mongoose.connection.close()
})