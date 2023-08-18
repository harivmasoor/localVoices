import csrfFetch from "./csrf";

export const RECEIVE_POSTS = 'posts/RECEIVE_POSTS';
export const RECEIVE_POST = 'posts/RECEIVE_POST';
export const REMOVE_POST = 'posts/REMOVE_POST';

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


/* 
Export a `getPost` selector that takes in a `postId` and returns the specified
post from the store.

Export a `getPosts` selector that returns an array of all the posts in the
store.
*/

export const getPost = (postId) => (state) => state.posts ? state.posts[postId] : null;

export const getPosts = state => state.posts ? Object.values(state.posts) : [];


/*
Export the following functions with the specified parameters:

1. `fetchPosts`
2. `fetchPost(postId)`
3. `createPost(post)`
4. `updatePost(post)`
5. `deletePost(postId)`

Each function should call `fetch` to perform the desired database operation and
dispatch the appropriate action upon a successful response. (You do not need to
do anything if the `fetch` response is unsuccessful.) 
*/

//from a component
//dispatch(fetchPosts())

export const fetchPosts = () => async dispatch =>{
    const res = await fetch('/api/posts');
    const posts = await res.json();
    dispatch(receivePosts(posts)); //dispatch({type: RECEIVE_POSTS, posts: {1: {title, body, id}}})
}

export const fetchPost = postId => async dispatch => {
    const res = await fetch(`/api/posts/${postId}`);
    const post = await res.json();
    dispatch(receivePost(post));
}

export const createPost = post => async dispatch => {
    const res = await csrfFetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const resPost = await res.json();
    dispatch(receivePost(resPost));
}

export const updatePost = post => async dispatch => {
    const res = await csrfFetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const resPost = await res.json();
    dispatch(receivePost(resPost));
}

export const deletePost = postId => async dispatch => {
    await csrfFetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    });
    // const resPost = await res.json();
    dispatch(removePost(postId));
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