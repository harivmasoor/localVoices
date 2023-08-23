import csrfFetch from "./csrf";
import { createSelector } from 'reselect';

export const RECEIVE_POSTS = 'posts/RECEIVE_POSTS';
export const RECEIVE_POST = 'posts/RECEIVE_POST';
export const REMOVE_POST = 'posts/REMOVE_POST';
// In your posts.js or a constants file if you have one
export const RECEIVE_POST_ERRORS = 'RECEIVE_POST_ERRORS';
export const CLEAR_POST_ERRORS = 'CLEAR_POST_ERRORS';
export const UPDATE_USER_PHOTO_IN_POSTS = 'posts/UPDATE_USER_PHOTO_IN_POSTS';


export const updateUserPhotoInPosts = (userId, photoUrl) => ({
    type: UPDATE_USER_PHOTO_IN_POSTS,
    userId,
    photoUrl
});

export const receivePosts = (posts)=>({
    type: RECEIVE_POSTS,
    posts 
});

export const receivePost = (data) => {
    return {
        type: RECEIVE_POST,
        data
    }
}

export const removePost = (postId) => {
    return {
        type: REMOVE_POST,
        postId
    }
}

export const receivePostErrors = (errors) => {
    return {
        type: RECEIVE_POST_ERRORS,
        errors
    }
}



export const getPost = (postId) => (state) => state.posts ? state.posts[postId] : null;

export const postsSelector = state => state.posts;

export const getPosts = createSelector(
  [postsSelector],
  (posts) => 
    posts ? Object.values(posts) : []
);




export const fetchPosts = () => async dispatch => {
    try {
        const res = await csrfFetch('/api/posts');
        if (res.ok) {
            const posts = await res.json();
            dispatch(receivePosts(posts));
            return posts; // return posts for potential future use
        } else {
            const errors = await res.json();
            dispatch(receivePostErrors(errors));
            throw new Error(errors); // Throwing an error will help you to catch this in your component if needed
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // re-throwing so that you can handle it if you want in your component
    }
}

export const fetchPost = postId => async dispatch => {
    const res = await csrfFetch(`/api/posts/${postId}`);
    if (res.ok) {
    const post = await res.json();
    dispatch(receivePost(post));
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
    }
}

export const createPost = (body, photo) => async dispatch => {
    const formData = new FormData();
    formData.append('post[body]', body);
    if (photo) {
        formData.append('post[photo]', photo);
    }

    const res = await csrfFetch(`/api/posts`, {
        method: 'POST',
        body: formData,
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(receivePost(data));
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
    }
}



export const updatePost = post => async dispatch => {
    const formData = new FormData();
    Object.keys(post).forEach(key => {
        formData.append(`post[${key}]`, post[key]);
    });

    const res = await csrfFetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: formData
    });
    if (res.ok) {
        const resPost = await res.json();
        dispatch(receivePost(resPost));
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
    }
}


export const deletePost = postId => async dispatch => {
    const res = await csrfFetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
    // const resPost = await res.json();
    dispatch(removePost(postId));
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
    }
}


export default function postsReducer(state={}, action){

    switch(action.type){
        case RECEIVE_POSTS:
            console.log("Received posts:", action.posts);
            return action.posts.reduce((acc, post) => {
                acc[post.id] = post;
                return acc;
            }, {});
        case RECEIVE_POST:
            return {...state, [action.data.post.id]: action.data.post}
        case REMOVE_POST:
            const nextState = {...state};
            delete nextState[action.postId];
            return nextState;
            // Inside postsReducer function in Posts.js
        case UPDATE_USER_PHOTO_IN_POSTS:
            return Object.fromEntries(Object.entries(state).map(([postId, post]) => {
                if(post.userId === action.userId) {
                    post.userPhotoUrl = action.photoUrl;
                }
                return [postId, post];
            }));
        default:
            return state;
    }
}