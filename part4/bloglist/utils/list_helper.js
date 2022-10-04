const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    // behavior is not described for blogs being empty so I am guessing
    if(blogs.length === 0){ return null }

    const reducer = (prev, curr) => {
        return (prev.likes > curr.likes)
            ? prev
            : curr
    }

    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    // behavior is not described for blogs being empty so I am guessing
    if(blogs.length === 0){ return null }

    const authorCount = _.countBy(blogs, (blog) => blog.author)
    const maxBlogs = _.maxBy(Object.keys(authorCount), author => authorCount[author])
    return { author: maxBlogs, blogs: authorCount[maxBlogs] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}
