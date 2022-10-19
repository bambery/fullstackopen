import React from 'react'
import { useState, useEffect } from 'react'

const BlogForm = (props) => {
    const { addBlog } = props

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [blogUrl, setBlogUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleBlogUrlChange = (event) => {
        setBlogUrl(event.target.value)
    }

    const handleBlogSubmit = (event) => {
        event.preventDefault()
        const blogObject = {
            title, author, url: blogUrl
        }

        addBlog(blogObject)
        setTitle('')
        setAuthor('')
        setBlogUrl('')
    }

    return (
        <form onSubmit={handleBlogSubmit}>
            <h2>create new</h2>
            <div>
                <label>
                    title:
                    <input
                        type="text"
                        onChange={handleTitleChange}
                        value={title}
                    />
                </label>
            </div>
            <div>
                <label>
                    author:
                    <input
                        type="text"
                        onChange={handleAuthorChange}
                        value={author}
                    />
                </label>
            </div>
            <div>
                <label>
                    url:
                    <input
                        type="text"
                        onChange={handleBlogUrlChange} 
                        value={blogUrl} 
                    />
                </label>
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm
