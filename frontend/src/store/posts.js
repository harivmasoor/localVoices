import csrfFetch from "./csrf";

export const RECEIVE_POSTS = 'posts/RECEIVE_POSTS';
export const RECEIVE_POST = 'posts/RECEIVE_POST';
export const REMOVE_POST = 'posts/REMOVE_POST';
// In your posts.js or a constants file if you have one
export const RECEIVE_POST_ERRORS = 'RECEIVE_POST_ERRORS';
export const CLEAR_POST_ERRORS = 'CLEAR_POST_ERRORS';


export const receivePosts = (posts)=>({
    type: RECEIVE_POSTS,
    posts 
});

export const receivePost = (post) => {
    return {
        type: RECEIVE_POST,
        post
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

export const getPosts = state => state.posts ? Object.values(state.posts) : [];




export const fetchPosts = () => async dispatch =>{
    const res = await csrfFetch('/api/posts');
    if (res.ok) {
    const posts = await res.json();
    dispatch(receivePosts(posts)); //dispatch({type: RECEIVE_POSTS, posts: {1: {title, body, id}}})
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
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

export const createPost = post => async dispatch => {
    const res = await csrfFetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    });

    if (res.ok) {
        const resPost = await res.json();
        dispatch(receivePost(resPost));
    } else {
        const errors = await res.json();
        dispatch(receivePostErrors(errors));
}
}

export const updatePost = post => async dispatch => {
    const res = await csrfFetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json'
        }
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



/*
Export a `postsReducer` function as the default export. It should take in the
old state and an action. It should appropriately handle all post actions, as
defined in the test specs.
*/

export default function postsReducer(state={}, action){

    switch(action.type){
        case RECEIVE_POSTS:
            return action.posts;
        case RECEIVE_POST:
            return {...state, [action.post.id]: action.post}
        case REMOVE_POST:
            const nextState = {...state};
            delete nextState[action.postId];
            return nextState;
        default:
            return state;
    }
}