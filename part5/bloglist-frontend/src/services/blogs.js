import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const unsetToken = () => {
    token = null
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const update = async (updatedBlog) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
//    console.log(`### inside blog service ${JSON.stringify(response)} ##`)
    console.log(JSON.stringify(response))
    return response.data
}

export default { getAll, setToken, unsetToken, create, update }
