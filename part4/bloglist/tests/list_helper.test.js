const listHelper = require('../utils/list_helper')
const listMocks  = require('./list_helper_test_cases')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('of an empty list is zero', () => {
        expect( listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog, equals the likes of that blog', () => {
        const result = listHelper.totalLikes(listMocks.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated correctly', () => {
        const result = listHelper.totalLikes(listMocks.listWithManyBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('when list has only one blog, return that blog', () => {
        // the exercise I could return a reduced object, but why? Why not return the entire blog object?
        const result = listHelper.favoriteBlog(listMocks.listWithOneBlog)
        expect(result).toEqual(listMocks.listWithOneBlog[0])
    })

    test('when no blogs have any likes, return the last one', () => {
        const result = listHelper.favoriteBlog(listMocks.listWithManyBlogsButNoLikes)
        expect(result).toEqual(listMocks.listWithManyBlogsButNoLikes[3])
    })

    test('of a bigger list with one that has the most likes, return that one', () => {
        const mostLikes = {
            id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }
        const result = listHelper.favoriteBlog(listMocks.listWithManyBlogs)
        expect(result).toEqual(mostLikes)
    })

    test('of a bigger list with more than one that has the most likes, return one of those tied for most likes - in this case, the sequentially last one in the arr', () => {
    const mostLikes = {
            id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 12,
        }
        const result = listHelper.favoriteBlog(listMocks.listWithManyBlogsAndTiedForLikes)
        expect(result).toEqual(mostLikes)
    })
})
