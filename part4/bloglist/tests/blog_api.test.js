const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('blogs api', () => {
    describe('getting existing blogs', () => {

        beforeAll(async () => {
            await helper.populateOneUser()
            await helper.populateBlogs()
        })

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
        beforeAll(async () => {
            await helper.populateTwoUsers()
            await helper.populateBlogs()
        })

        test('a valid blog can be added', async () => {
            testUser = helper.testUsers.TEST_USER_1

            const userToken = await helper.logUserIn(username = testUser.username, password = testUser.password )
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
            const testUser = helper.testUsers.TEST_USER_2
            const user = await User.findOne({ username: testUser.username})
            const userToken = await helper.logUserIn(testUser.username, testUser.password)
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

            const blogsAtEnd = await helper.blogsInDb()
            const blog = blogsAtEnd.find(blog => blog.title === 'Abusing HTTP hop-by-hop request headers' )

            expect(blog.user.toString()).toBe(user.id)
        })

        describe('missing submission properties', () => {

            test('blog created without likes is successful and will have zero likes', async () => {
                const testUser = helper.testUsers.TEST_USER_2
                const userToken = await helper.logUserIn(testUser.username, testUser.password)
                const blogsAtStart = await helper.blogsInDb()
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
                expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
                const newBlog = blogsAtEnd.find( b => b.title === 'Emanuel Derman\'s Apologia Pro Vita Sua' )
                expect(newBlog.likes).toBe(0)
            })

            test('blog missing title is not created', async () => {
                const testUser = helper.testUsers.TEST_USER_2
                const userToken = await helper.logUserIn(testUser.username, testUser.password)
                const blogsAtStart = await helper.blogsInDb()
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
                expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
            })

            test('blog missing url is not created', async () => {
                const testUser = helper.testUsers.TEST_USER_2
                const userToken = await helper.logUserIn(testUser.username, testUser.password)
                const blogsAtStart = await helper.blogsInDb()
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
                expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
            })

            test('creation fails if user is not authenticated', async ()=> {
                const testUser = helper.testUsers.TEST_USER_1
                let userToken = await helper.logUserIn(testUser.username, testUser.password)
                userToken = userToken.substring(0, userToken.length - 3).concat('aaa')
                const blogsAtStart = await helper.blogsInDb()
                const blogObject = {
                    title: 'this user has an incorrect token',
                    url: 'https://www.dne.com',
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `bearer ${userToken}`)
                    .send(blogObject)
                    .expect(401)

                const blogsAtEnd = await helper.blogsInDb()

                expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
            })
        })
    })

    describe('deleting a blog', () => {
        beforeEach(async () => {
            await helper.populateTwoUsers()
            await helper.populateBlogs()
        })

        test('fails if user did not create the Blog', async () => {
            const testUser = helper.testUsers.TEST_USER_1
            let userToken = await helper.logUserIn(testUser.username, testUser.password)
            userToken = userToken.substring(0, userToken.length - 3).concat('aaa')

            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `bearer ${userToken}`)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.length).toBe(blogsAtStart.length)
        })

        test('succeeds if deleted by the User who created it', async () => {

            const testUser = helper.testUsers.TEST_USER_1
            let userToken = await helper.logUserIn(testUser.username, testUser.password)

            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `bearer ${userToken}`)
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
