const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

describe('users api', () => {

    afterAll(() => {
        mongoose.connection.close()
    })

    describe('creating a new user', () => {

        beforeAll(async () => {
            await helper.populateOneUser()
        })

        test('creation succeeds with proper inputs', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                username: 'mluukai',
                password: 'salainen',
            }

            await api
                .post('/api/users')
                .send(userObject)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

            const usernames = usersAtEnd.map( u => u.username)
            expect(usernames).toContain(userObject.username)
        })

        test('creation fails if username is already taken', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                username: helper.testUsers.TEST_USER_1.username,
                password: 'salainen',
            }

            const result = await api
                .post('/api/users')
                .send(userObject)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('username must be unique')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })

        test('creation fails if username is missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                name: 'Test User',
                password: 'salainen',
            }

            const result = await api
                .post('/api/users')
                .send(userObject)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toMatch(/.+username.+is required.+/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })

        test('creation fails if password is missing', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                name: 'Test User',
                username: 'aUniqueUsername',
            }

            const result = await api
                .post('/api/users')
                .send(userObject)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toMatch(/.+password.+is required.+/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })
        test('creation fails if username is shorter than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                username: 'hi',
                password: 'salainen',
            }

            const result = await api
                .post('/api/users')
                .send(userObject)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toMatch(/.+username.+shorter than the minimum allowed length/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })

        test('creation fails if password is shorter than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const userObject = {
                username: 'testUser2',
                password: 'no',
            }

            const result = await api
                .post('/api/users')
                .send(userObject)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error)
                .toMatch(/.+password.+shorter than the minimum allowed length/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })


    })

    describe('fetching existing users', () => {
        test('existing User is returned with list of their blog posts', async () => {
            await Blog.deleteMany({})
            await helper.populateOneUser()

            const testUser = helper.testUsers.TEST_USER_1

            const user = await User.findOne({ username: testUser.username })
            const userToken = await helper.logUserIn(testUser.username, testUser.password)
            const newBlog = {
                title: 'new blog 1',
                author: 'new author 1',
                url: 'https://www.google.com',
                likes: 0
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${userToken}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const newBlog2 = {
                title: 'new blog 2',
                author: 'new author 1',
                url: 'https://www.google.com',
                likes: 10
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${userToken}`)
                .send(newBlog2)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api
                .get('/api/users/')
            const userResponse = response.body.find( u => u.id === user.id )
            expect(userResponse.blogs).toHaveLength(2)
            const contents = userResponse.blogs.map( b => b.title )
            expect(contents).toContain('new blog 1')
            expect(contents).toContain( 'new blog 2')
        }, 10000)
    })
})


