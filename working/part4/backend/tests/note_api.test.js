const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Note = require('../models/note')

// the material does not discuss how to mock out authentication/authorization so I'm going to try this. I'm sure later the course will use mock-jwks or some other package
const TEST_PASS = 'losenord'
const TEST_USERNAME = 'testUser'

beforeAll(async () => {
    users = await helper.createTestUser(TEST_USERNAME, TEST_PASS)
})

beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
})

describe('notes api', () => {
    describe('when there are existing notes', () => {

        test('notes are returned as json', async () => {
            await api
                .get('/api/notes')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all notes are returned', async () => {
            const response = await api.get('/api/notes/')

            expect(response.body).toHaveLength(helper.initialNotes.length)
        })

        test('a specific note is within the returned notes', async () => {
            const response = await api.get('/api/notes')

            const contents = response.body.map(r => r.content)
            expect(contents).toContain('Browser can execute only Javascript')
        })
    })

    describe('viewing a specific note', () => {
        test('succeeds with a valid id', async () => {
            const notesAtStart = await helper.notesInDb()

            const noteToView = notesAtStart[0]

            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

            expect(resultNote.body).toEqual(processedNoteToView)
        })

        test('fails with statuscode 404 if note does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/notes/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400)
        })
    })

    describe('the addition of a new note', () => {
        beforeAll(async () => {
        })

        test('succeeds with valid data', async () => {

            const newNote = {
                content: 'async/await simplifies making async calls',
                important: true,
                userId: 
            }

            await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const notesAtEnd = await helper.notesInDb()
            expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

            const contents = notesAtEnd.map(n => n.content)
            expect(contents).toContain(
                'async/await simplifies making async calls'
            )
        })

        test('fails with status code 400 if missing required info', async () => {
            const newNote = {
                important: true
            }

            await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)

            const notesAtEnd = await helper.notesInDb()

            expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
        })
    })

    describe('deletion of a note', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const notesAtStart = await helper.notesInDb()
            const noteToDelete = notesAtStart[0]

            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204)

            const notesAtEnd = await helper.notesInDb()

            expect(notesAtEnd).toHaveLength(
                helper.initialNotes.length - 1
            )

            const contents = notesAtEnd.map(r => r.content)

            expect(contents).not.toContain(noteToDelete.content)
        })
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})
