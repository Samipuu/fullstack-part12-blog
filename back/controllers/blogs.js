const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { getTokenFrom, userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')

    response.json(blogs)
})

blogsRouter.post('/', getTokenFrom, userExtractor, async (request, response) => {
    const blog = new Blog(request.body)
    const user = request.user


    blog.user = user.id


    const result = await blog.save()
    user.blogs.push(blog._id)
    const resultUser = await user.save()

    response.status(201).json(result)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const comment = request.body
    const id = request.params.id

    const blog = await Blog.findById(id)

    const blogToUpdate = new Blog({_id: id, comments: [...blog.comments, comment.comment]})
    const result = await Blog.findByIdAndUpdate(id, blogToUpdate)
    response.status(201).json(result)
})

blogsRouter.delete('/:id', getTokenFrom, userExtractor, async (request, response) => {
    const id = request.params.id

    const blog = await Blog.findById(id)

    if (!blog.user.toString() === request.user.id) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    const result = await Blog.findByIdAndDelete(id)

    response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        _id: id
    })



    const result = await Blog.findByIdAndUpdate(id, blog)
    response.json(result)
})

module.exports = blogsRouter