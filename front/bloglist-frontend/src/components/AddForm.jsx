import { useState } from 'react'


const AddForm = ({ handleNewBlog }) => {

    const [blogName, setBlogName] = useState('')
    const [blogTitle, setBlogTitle] = useState('')
    const [blogURL, setBlogURL] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        handleNewBlog({
            title: blogTitle,
            author: blogName,
            url: blogURL
        })

        setBlogName('')
        setBlogTitle('')
        setBlogURL('')
    }
    return (
        < form onSubmit={addBlog} >
            <div>
                <h2>Create new blog</h2>
                <div>
                    Title:
                    <input
                        type='text'
                        value={blogTitle}
                        name='Title'
                        id='title'
                        onChange={({ target }) => setBlogTitle(target.value)} />
                </div>
                <div>
                    Author
                    <input
                        type="text"
                        value={blogName}
                        name="Author"
                        id='author'
                        onChange={({ target }) => setBlogName(target.value)}
                    />
                </div>
                <div>
                    URL:
                    <input
                        type='text'
                        value={blogURL}
                        name='URL'
                        id='url'
                        onChange={({ target }) => setBlogURL(target.value)}
                    />
                </div>
            </div>
            <button type="submit" id='createButton'>Create</button>
        </form >)
}




export default AddForm