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

    // exercise 4.10
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Cryptocurrency-enabled Crime',
            author: 'David Rosenthal',
            url: 'https://blog.dshr.org/2022/09/cryptocurrency-enabled-crime.html',
            likes: 6
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await tc.blogsInDb()
        expect(blogsAtEnd).toHaveLength(tc.listWithManyBlogs.length + 1)
        const contents = blogsAtEnd.map( b => b.title )
        expect(contents).toContain(
            'Cryptocurrency-enabled Crime'
        )
    })

    describe('creating blogs missing submission properties', () => {
        // exercise 4.11
        test('blog created without likes will have zero likes', async () => {
            const blogObject = {
                title: 'Emanuel Derman\'s Apologia Pro Vita Sua',
                author: 'Cathy O\'Neil',
                url: 'https://mathbabe.org/2012/09/17/emanuel-dermans-apologia-pro-vita-sua/',
            }

            await api
                .post('/api/blogs')
                .send(blogObject)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await tc.blogsInDb()
            expect(blogsAtEnd).toHaveLength(tc.listWithManyBlogs.length + 1)
            const newBlog = blogsAtEnd.find( b => b.title === 'Emanuel Derman\'s Apologia Pro Vita Sua' )
            expect(newBlog.likes).toBe(0)
        })

        // exercise 4.12
        test('blog missing title is not added', async () => {
            const blogObjectNoTitle = {
                author: 'Ashley Carman and Davey Alba',
                url: 'https://www.bloomberg.com/news/articles/2022-10-06/podcasts-spur-listeners-to-swamp-health-workers-with-angry-calls',
            }

            await api
                .post('/api/blogs')
                .send(blogObjectNoTitle)
                .expect(400)

            const blogsAtEnd = await tc.blogsInDb()
            expect(blogsAtEnd).toHaveLength(tc.listWithManyBlogs.length)
        })

        // exercise 4.12
        test('blog missing url is not added', async () => {
            const blogObjectNoUrl = {
                title: 'Health-Care Workers Are Swamped Again, This Time With Angry Calls From Podcast Listeners',
                author: 'Ashley Carman and Davey Alba',
            }

            await api
                .post('/api/blogs')
                .send(blogObjectNoUrl)
                .expect(400)

            const blogsAtEnd = await tc.blogsInDb()
            expect(blogsAtEnd).toHaveLength(tc.listWithManyBlogs.length)
        })
    })

    describe('deleting a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await tc.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await tc.blogsInDb()
            expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
        })
    })

    describe('updating an existing blog', () => {
        test('to change the like count', async () => {
            const blogsAtStart = await tc.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            console.log(`blog to update: ${blogToUpdate.toJSON}`)
            const blogObjectUpdateLikes = {
                likes: blogToUpdate.likes + 1,
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogObjectUpdateLikes)
                .expect(200)

            const blogsAtEnd = await tc.blogsInDb()
            const updatedBlog = blogsAtEnd.find( blog => blog.id === blogToUpdate.id)
            console.log(`blog had been updated: ${updatedBlog}`)
            expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})
