const _ = require('lodash')

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

const mostLikes = (blogs) => {
    // behavior is not described for blogs being empty so I am guessing
    if(blogs.length === 0){ return null }

    const reducer = ( acc, curr ) => {
        acc[curr.author] = acc[curr.author]
            ? acc[curr.author] + Number(curr.likes)
            : Number(curr.likes)
        return acc
    }

    const likeCount = blogs.reduce(reducer, {})
    const maxLikes = _.maxBy(Object.keys(likeCount), likes => likeCount[likes])
    return { author: maxLikes, likes: likeCount[maxLikes] }
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
