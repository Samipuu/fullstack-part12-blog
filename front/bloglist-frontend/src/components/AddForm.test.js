import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import AddForm from './AddForm'

describe('<AddForm />', () => {
    let container
    let mockHandler

    beforeEach(() => {

        mockHandler = jest.fn()
        container = render(<AddForm handleNewBlog={mockHandler} />).container
    })

    test('when blog is created right information is in the blog', async () => {
        const blog = { title: 'Title', author: 'Author', url: 'URL' }
        const user = userEvent.setup()
        const button = screen.getByText('Create')
        const inputs = screen.getAllByRole('textbox')
        await user.type(inputs[0], 'Title')
        await user.type(inputs[1], 'Author')
        await user.type(inputs[2], 'URL')
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0]).toEqual(blog)
    })

})