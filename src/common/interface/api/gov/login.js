import axios from '../../axios.decoration'

export const  login = (params)=>axios.postForm('/user/login',params)

export const logout = (params) => axios.get('/user/logout',params)