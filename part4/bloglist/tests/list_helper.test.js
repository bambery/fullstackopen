const listHelper = require('../utils/list_helper')
const listMocks  = require('./test_helper')

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
    test('when the list of blogs is empty, get back null', () => {
        expect( listHelper.favoriteBlog([])).toBe(null)
    })

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
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }
        const result = listHelper.favoriteBlog(listMocks.listWithManyBlogs)
        expect(result).toMatchObject(mostLikes)
    })

    test('of a bigger list with more than one that has the most likes, return one of those tied for most likes', () => {
        const mostLikes = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 12,
        }
        const result = listHelper.favoriteBlog(listMocks.listWithManyBlogsAndTiedForLikes)
        expect(result.likes).toEqual(mostLikes.likes)
    })
})

describe('author with most blogs', () => {
    // this behavior is not described by the exercises so I am guessing
    test('given an empty list, returns null', () => {
        expect( listHelper.mostBlogs([])).toBe(null)
    })

    test('of a bigger list with a clear winner, return that one', () => {
        const mostBlogs = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        const result = listHelper.mostBlogs(listMocks.listWithManyBlogs)
        expect(result).toEqual(mostBlogs)
    })

    test('of a list where there is no clear winner, return one tied for # of blog posts', () => {
        const mostBlogs = {
            author: 'Robert C. Martin',
            blogs: 2
        }
        const result = listHelper.mostBlogs(listMocks.listWithSeveralAuthorsWith2Blogs)
        expect(result.blogs).toEqual(mostBlogs.blogs)
    })
})

describe('author with most likes across all blogs', () => {
    // this behavior is not described by the exercises so I am guessing
    test('given an empty list, returns null', () => {
        expect( listHelper.mostLikes([])).toBe(null)
    })

    test('of a list with a clear winner, return the author and like count', () => {
        const mostLikes = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(listHelper.mostLikes(listMocks.listWithManyBlogs)).toEqual(mostLikes)
    })

    test('given a list with more than one author with the max # of likes, return one of them', () => {
        const mostLikes = {
            author: 'Edsger W. Dijkstra',
            likes: 15
        }
        expect(listHelper.mostLikes(listMocks.listWithAuthorsSameNumLikes).likes).toBe(mostLikes.likes)
    })
})
