const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id/', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if( user.id === blog.user.toString() ){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'only the user who created a blog post may delete it' })
    }
})

blogsRouter.put('/:id/', (request, response) => {
    const blog = request.body
    // need to remove the mongoose populated user object and replace with plain user id of original blog creator
    blog.user = request.body.user.id

    Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
        runValidators: true,
        context: 'query'
    })
        .populate('user', { username: 1, name: 1 })
        .then(updatedNote => {
            return response.json(updatedNote)
        })
})

module.exports = blogsRouter
