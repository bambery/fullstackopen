const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)


describe('blogs api', () => {
    beforeAll(async () => {
        await helper.populateOneUser()
        await helper.populateBlogs()
    })

    describe('getting existing blogs', () => {

        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs/')
            expect(response.body).toHaveLength(helper.listWithManyBlogs.length)})

        test('blogs are uniquely identified by "id"', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body[0].id).toBeDefined()
        })
    })

    describe('creating Blogs', () => {
        beforeEach(async () => {
            await helper.populateTwoUsers()
            await helper.populateBlogs()

        })

        test('a valid blog can be added', async () => {
            const user = await User.findOne({ username: helper.TEST_USERNAME1 })
            const userToken = await helper.logUserIn(user.username, user.id)
            const newBlog = {
                title: 'Cryptocurrency-enabled Crime',
                author: 'David Rosenthal',
                url: 'https://blog.dshr.org/2022/09/cryptocurrency-enabled-crime.html',
                likes: 6
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${userToken}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
            const contents = blogsAtEnd.map( b => b.title )
            expect(contents).toContain(
                'Cryptocurrency-enabled Crime'
            )
        })

        test('a valid blog is associated with the User who created it', async () => {

            const user = await User.findOne({ username: helper.TEST_USERNAME2 })
            const userToken = await helper.logUserIn(user.username, user.id)
            const newBlog = {
                title: 'Abusing HTTP hop-by-hop request headers',
                author: 'Nathan Davison',
                url: 'https://nathandavison.com/blog/abusing-http-hop-by-hop-request-headers',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${userToken}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            // note that blogsInDb does not pass through the controller and thus does not populate the User, but it does retain the user's id
            const blogsAtEnd = await helper.blogsInDb()
            const blog = blogsAtEnd.find(blog => blog.title === 'Abusing HTTP hop-by-hop request headers' )

            expect(JSON.stringify(blog.user).replaceAll('\"', '')).toBe(user.id)
        })

        describe('missing submission properties', () => {

            test('blog created without likes is successful and will have zero likes', async () => {
                const user = await User.findOne({ username: helper.TEST_USERNAME2 })
                const userToken = await helper.logUserIn(user.username, user.id)
                const blogObject = {
                    title: 'Emanuel Derman\'s Apologia Pro Vita Sua',
                    author: 'Cathy O\'Neil',
                    url: 'https://mathbabe.org/2012/09/17/emanuel-dermans-apologia-pro-vita-sua/',
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `bearer ${userToken}`)
                    .send(blogObject)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                const blogsAtEnd = await helper.blogsInDb()
                expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
                const newBlog = blogsAtEnd.find( b => b.title === 'Emanuel Derman\'s Apologia Pro Vita Sua' )
                expect(newBlog.likes).toBe(0)
            })

            test('blog missing title is not created', async () => {
                const user = await User.findOne({ username: helper.TEST_USERNAME2 })
                const userToken = await helper.logUserIn(user.username, user.id)
                const blogObjectNoTitle = {
                    author: 'Ashley Carman and Davey Alba',
                    url: 'https://www.bloomberg.com/news/articles/2022-10-06/podcasts-spur-listeners-to-swamp-health-workers-with-angry-calls',
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `bearer ${userToken}`)
                    .send(blogObjectNoTitle)
                    .expect(400)

                const blogsAtEnd = await helper.blogsInDb()
                expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
            })

            test('blog missing url is not created', async () => {
                const user = await User.findOne({ username: helper.TEST_USERNAME2 })
                const userToken = await helper.logUserIn(user.username, user.id)
                const blogObjectNoUrl = {
                    title: 'Health-Care Workers Are Swamped Again, This Time With Angry Calls From Podcast Listeners',
                    author: 'Ashley Carman and Davey Alba',
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `bearer ${userToken}`)
                    .send(blogObjectNoUrl)
                    .expect(400)

                const blogsAtEnd = await helper.blogsInDb()
                expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
            })

            test('creation fails if user is not authenticated', async ()=> {
                //todo
            })
        })
    })

    describe('deleting a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
        })
    })

    describe('updating an existing blog', () => {
        test('to change the like count', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            const blogObjectUpdateLikes = {
                likes: blogToUpdate.likes + 1,
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogObjectUpdateLikes)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlog = blogsAtEnd.find( blog => blog.id === blogToUpdate.id)
            expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})
