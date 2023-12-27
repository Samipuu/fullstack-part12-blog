import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


describe('<Blog />', () => {
    let container
    let mockHandler

    beforeEach(() => {
        const user = { username: 'test', name: 'testUser' }
        const blog = {
            title: 'This is a blog',
            author: 'Sami',
            likes: '9999',
            url: 'blog.fi',
            user
        }
        mockHandler = jest.fn()
        container = render(<Blog blog={blog} likeBlog={mockHandler}></Blog>).container
    })


    test('renders title and author but not URL or Likes', () => {
        const div = container.querySelector('.blog')
        expect(div).toHaveTextContent('This is a blog')
        expect(div).toHaveTextContent('Sami')
        const div2 = container.querySelector('.moreInformation')
        expect(div2).toHaveStyle('display: none')

    })

    test('likes and url is shown when button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('View')
        await user.click(button)

        const div = container.querySelector('.moreInformation')
        expect(div).not.toHaveStyle('display: none')
    })

    test('when like button is clicked. Correct amount of calls have happened', async () => {

        const user = userEvent.setup()
        const button = screen.getByText('Like')
        await user.click(button)
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })

})

