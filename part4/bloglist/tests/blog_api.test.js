const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const tc = require('./list_helper_test_cases')
//const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await tc.populateBlogs()
})

describe('blogs api', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    // exercise 4.8
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs/')
        expect(response.body).toHaveLength(tc.listWithManyBlogs.length)})

    // exercise 4.9
    test('blogs are uniquely identified by "id"', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0]).toBeDefined()
    })

})

afterAll(() => {
    mongoose.connection.close()
})
