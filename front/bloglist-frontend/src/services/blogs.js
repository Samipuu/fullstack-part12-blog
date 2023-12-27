import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const addBlog = async (newBlog) => {
  const request = await axios.post(baseUrl, newBlog, { headers: { 'Authorization': `bearer ${newBlog.user.token}` } })
  return request.data
}

const update = async (props) => {
  const request = await axios.put(`${baseUrl}/${props.blog.id}`, props.blog)
  return request.data
}

const remove = async (id, user) => {
  const request = await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization': `bearer ${user.token}` } })
  return request.data
}

export default { getAll, addBlog, update, remove }