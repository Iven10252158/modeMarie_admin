import axios, { AxiosResponse, AxiosError } from 'axios'

const useApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API
  // timeout: 10000
})

useApi.interceptors.request.use(request => {
  // const token = JSON.parse(localStorage.getItem('token') as string)
  // request.headers.Authorization = token
  // console.log(request)
  // console.log(token)

  return Promise.resolve(request)
}, error => {
  return Promise.reject(error)
})

useApi.interceptors.response.use((response:AxiosResponse) => {
  return Promise.resolve(response)
}, (error:AxiosError) => {
  return Promise.reject(error)
})

const queryUrl = (url:string, params?: any) => {
  // console.log('params', params)

  if (!params) return url
  let baseURL = url + '?'
  Object.keys(params).forEach(key => {
    // console.log(key)
    baseURL += `${key}=${params[key]}&`
  })
  return baseURL
}

const Post = (url:string, data?:any) => {
  return useApi.post(url, data)
}

const Get = (url:string, params?:any, data?:any) => {
  const queryString = queryUrl(url, params)

  return useApi.get(queryString, data)
}

export {
  Post,
  Get
}
