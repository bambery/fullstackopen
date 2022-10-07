const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const tc = require('./list_helper_test_cases')

const api = supertest(app)

describe('blogs api', () => {

    test('notes are returned as json', async () => {
        // will populate using default listWithManyBlogs
        await tc.populateBlogs()

        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        await tc.populateBlogs()
        const response = await api.get('/api/blogs/')
        expect(response.body).toHaveLength(tc.listWithManyBlogs.length)})

})

afterAll(() => {
    mongoose.connection.close()
})
