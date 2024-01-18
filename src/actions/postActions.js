import axios from '../config/axios'

export const getPostDispatch = (data) => {
    return {type: 'GET_POSTS', payload: data}
}

export const addPostDispatch = (data) => {
    return {type: 'ADD_POST', payload: data}
}
export const getPostsFunc = () => {
    return async(dispatch) => {
        try{
            const posts = await axios.get('api/getPosts')
            dispatch(getPostDispatch({data: [...posts.data], serverErrors: {}}))
        }catch(e){
            if(e.code=='ERR_NETWORK'){
                dispatch(getPostDispatch({serverErrors: {errors: 'network error'}}))
            }else{
                dispatch(getPostDispatch({serverErrors: e.response.data}))
            }
        }
    }
}