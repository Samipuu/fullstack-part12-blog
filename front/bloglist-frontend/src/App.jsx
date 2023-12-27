import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddForm from './components/AddForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './utils/notification'
import './index.css'
import Togglable from './utils/visibility'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const addFormRef = useRef()


  const compareLikes = (a, b) => {
    return -(a.likes - b.likes)
  }
  blogs.sort(compareLikes)

  const likeBlogOf = async (id) => {
    let blogToUpdate = blogs.find(blog => blog.id === id)
    blogToUpdate.likes += 1
    const result = await blogService.update({ id: id, blog: blogToUpdate })
    setBlogs(blogs.map(blog => blog.id !== id ? blog : blogToUpdate))
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Login was successful')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log('Login failed')
      setNotification(`error Login failed ${exception}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleNewBlog = async (blog) => {
    console.log(`Creating new blog ${blog.title}`)
    try {
      const newBlog = { user: user, title: blog.title, author: blog.author, url: blog.url }
      const result = await blogService.addBlog(newBlog)
      result.user = user
      setBlogs(blogs.concat(result))
      setNotification(`Blog ${blog.title} has been added`)
      console.log(result)
      addFormRef.current.toggleVisibility()
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (exception) {
      console.log('Creating failed')
      console.log(exception)
      setNotification(`error ${exception}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const logout = (event) => {
    console.log('Logging out')
    setUser(null)
    window.localStorage.clear()
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <LoginForm handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} password={password} username={username} />
      </div>
    )
  }

  return (
    <div>
      Logged in as {user.username} <button onClick={logout}>Logout</button>
      <Notification message={notification} />
      <Togglable buttonLabel='Add blog' ref={addFormRef}>
        <AddForm handleNewBlog={handleNewBlog} />
      </Togglable>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={() => likeBlogOf(blog.id)} />
      )}
    </div>
  )
}

export default App