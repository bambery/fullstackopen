const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('users api with one existing user in db', () => {
    beforeEach(async () => {
        await helper.populateOneUser()
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    describe('creating a new user', () => {
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
                username: 'testUser',
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

    test('existing User is returned with list of their blog posts', async () => {
        const usersAtStart = await helper.usersInDb()
        helper.populateBlogs()
        const numBlogs = helper.blogsInDb.length

        const user = usersAtStart[0]
        expect(user.blogs).toHaveLength(numBlogs)
    })
})


