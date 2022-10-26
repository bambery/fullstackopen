import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
    test('renders title and author but not additional content', async () => {

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

    const container = render(
        <Blog blog={blog} updateBlog={mockHandler} displayDelete={true} deleteBlog={mockHandler}/>
    )
        const element = container.getByText('my first blog test', { exact:false })
        expect(element).toBeVisible()

        const hiddenLikes = container.getByText('likes', { exact:false })
        expect(hiddenLikes).not.toBeVisible()

        const hiddenUrl = container.getByText('http://', { exact: false })
        expect(hiddenUrl).not.toBeVisible()
    })
})
