import axios from 'axios'

export const http = axios.create({
  withCredentials: true,
})

http.interceptors.response.use(
  (resp) => resp,
  (err) => Promise.reject(err),
)

export default http
