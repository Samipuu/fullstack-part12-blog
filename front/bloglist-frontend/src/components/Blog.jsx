import { useState, forwardRef, useImperativeHandle } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, likeBlog }) => {

  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  const user = JSON.parse(loggedUserJSON)
  const [visibility, setVisibility] = useState(true)
  const buttonText = visibility ? 'View' : 'Hide'
  const hidden = { display: visibility ? 'none' : '' }
  const createdBy = { display: blog.user.username !== user.username ? 'none' : '' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const removeBlog = () => {
    if (!window.confirm(`Are you sure you want to remove blog ${blog.title}`)) {
      return
    }
    document.getElementById(blog.id).remove()
    blogService.remove(blog.id, user)
  }


  console.log(blog)
  console.log(blog.user)
  return (
    <div id={blog.id} className='blog'>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonText}</button>
      <div style={hidden} className='moreInformation'>
        {blog.url}<br />
        Likes: {blog.likes} <button onClick={likeBlog}>Like</button><br />
        {blog.user.username}<br />
        <button style={createdBy} onClick={removeBlog}>Remove</button>
      </div>
    </div >)
}

export default Blog