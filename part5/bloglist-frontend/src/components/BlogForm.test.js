import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Adding a new Blog', () => {
    const addBlogMock = jest.fn()

    beforeEach( () => {
        render(
            <BlogForm addBlog={addBlogMock} />
        )
    })

    test('with correct information sends the proper details to the event handler', async () => {

        const user = userEvent.setup()
        const submitButton = screen.getByRole('button', {name: 'create' })
        const title = 'test blog title'
        const titleInput = screen.getByRole('textbox', { name: 'title:' })
        const url = 'https://www.test.com'
        const urlInput = screen.getByRole('textbox', {name: 'url:' })
        const author = 'Test Author'
        const authorInput = screen.getByRole('textbox', {name: 'author:' })

        await user.type(titleInput, title)
        await user.type(urlInput, url)
        await user.type(authorInput, author)

        await user.click(submitButton)

        expect(addBlogMock.mock.calls[0][0]).toEqual( {"author": author, "title": title, "url": url} )

    }, 500000)
})
