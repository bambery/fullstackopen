const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

test('existing user logs in and gets token', async () => {
    await helper.populateOneUser()

    const testUser = { ...helper.testUsers.TEST_USER_1 }

    const response = await api
        .post('/api/login')
        .send(testUser)
        .expect(200)

    expect(response.body.token).toBeDefined()
})

test('user with incorrect password is not logged in', async () => {
    await helper.populateOneUser()

    const testUser = { ...helper.testUsers.TEST_USER_1 }
    testUser.password = 'incorrect'

    const response = await api
        .post('/api/login')
        .send(testUser)
        .expect(401)

    expect(response.error.text).toContain('Invalid username or password')
})

afterAll(() => {
    mongoose.connection.close()
})
