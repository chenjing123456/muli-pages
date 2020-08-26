import axios from '../../axios.decoration'

export const getTownList = params => axios.get('/gov/entTransformation/getTownList', params);

export const  login = (params)=>axios.postForm('/user/login',params)
