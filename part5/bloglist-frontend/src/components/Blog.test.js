import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
    let container

    const blog = {
        likes: 5,
        title: 'my first blog test',
        author: 'Test Author 1',
        url: 'http://www.web3isgoinggreat.com',
        user: {
            name: 'Posting User A'
        }
    }

    const mockHandler = jest.fn()

    beforeEach(() => {
        render(
            <Blog blog={blog} updateBlog={mockHandler} displayDelete={true} deleteBlog={mockHandler}/>
        )
    })

    test('renders title and author but not additional content', async () => {

        const element = screen.getByText('my first blog test', { exact:false })
        expect(element).toBeVisible()

        const hiddenLikes = screen.getByText('likes', { exact:false })
        expect(hiddenLikes).not.toBeVisible()

        const hiddenUrl = screen.getByText('http://', { exact: false })
        expect(hiddenUrl).not.toBeVisible()
    })

    test('display blog url and likes when the show/hide button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show')
        const hiddenLikes = screen.getByText('likes', { exact:false })
        const hiddenUrl = screen.getByText('http://', { exact: false })

        await user.click(button)

        expect(hiddenLikes).toBeVisible()
        expect(hiddenUrl).toBeVisible()
    })
})
