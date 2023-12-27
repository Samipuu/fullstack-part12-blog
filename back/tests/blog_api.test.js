const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
let token = ''

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        username: "root",
        password: "salainen"
    }

    await api.post('/api/users').send(newUser)

    const result = await api.post('/api/login').send(newUser)
    token = result.body.token

    const newBlog = {
        title: "Samin blogi",
        author: "Sami",
        url: "www.sami.fi",
        likes: 9999
    }

    const result2 = await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

})

test('blogs can be updated', async () => {
    const getResponse = await api.get('/api/blogs')
    console.log(getResponse.body)
    const newBlog = {
        title: 'Samin blogi',
        author: 'Sami',
        url: 'www.test.fi',
        likes: 20000
    }

    const updateResponse = await api.put(`/api/blogs/${getResponse.body[0].id}`).send(newBlog)

    const test = await api.get('/api/blogs')


    expect(test.body[0]).toMatchObject(newBlog)
})

test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
        .expect('Content-Type', /application\/json/)


    expect(response.body).toHaveLength(1)
})

test('blogs can be deleted', async () => {
    const getResponse = await api.get('/api/blogs')
    const deleteResponse = await api.delete(`/api/blogs/${getResponse.body[0].id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    const result = await api.get('/api/blogs')
    expect(result.body.length).toBe(0)
})

test('blogs unique identifier is ID', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('blogs can be added', async () => {
    const responseBefore = await api.get('/api/blogs')

    const newBlog = {
        title: 'Test blog',
        author: 'Sami',
        url: 'www.test.fi',
        likes: 9999
    }
    const added = await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    const responseAfter = await api.get('/api/blogs')

    expect(responseAfter.body).toHaveLength(responseBefore.body.length + 1)
    expect(added.body).toMatchObject(newBlog)

})

test('blogs without likes value get correct default value', async () => {
    const newBlog = {
        title: 'Test likes',
        author: 'Sami',
        url: 'www.test.fi'
    }

    const added = await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
    expect(added.body.likes).toBe(0)
})

test('blogs posted without url/title end in error', async () => {
    let newBlog = {
        title: 'Error url missing',
        author: 'Sami'
    }

    let added = await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

    newBlog = {
        author: 'Sami',
        url: 'Title missing'
    }

    added = await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})