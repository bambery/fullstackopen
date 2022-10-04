const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

//    return blogs.map(blog => blog.likes).reduce(reducer, 0)
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (prev, curr) => {
        return (prev.likes > curr.likes)
            ? prev
            : curr
    }

    return blogs.reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
