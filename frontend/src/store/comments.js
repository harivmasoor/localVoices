import csrfFetch from "./csrf";
import { RECEIVE_POST } from "./posts";


// Action Types
export const RECEIVE_COMMENTS = 'comments/RECEIVE_COMMENTS';
export const RECEIVE_COMMENT = 'comments/RECEIVE_COMMENT';
export const REMOVE_COMMENT = 'comments/REMOVE_COMMENT';
export const RECEIVE_COMMENT_ERRORS = 'comments/RECEIVE_COMMENT_ERRORS';
// New action type
export const CLEAR_COMMENT_ERRORS = 'comments/CLEAR_COMMENT_ERRORS';

// Action Creators

export const receiveComments = (comments) => ({
    type: RECEIVE_COMMENTS,
    comments
});

export const receiveComment = (comment) => ({
    type: RECEIVE_COMMENT,
    comment
});

export const removeComment = (commentId) => ({
    type: REMOVE_COMMENT,
    commentId
});

export const receiveCommentErrors = (errors) => ({
    type: RECEIVE_COMMENT_ERRORS,
    errors
});

// New action creator
export const clearCommentErrors = () => ({
    type: CLEAR_COMMENT_ERRORS
});

// Thunks

// Thunk for fetching all comments

export const fetchCommentsByPostId = (postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments?postId=${postId}`);
    if (res.ok) {
        const comments = await res.json();
        dispatch(receiveComments(comments));
    } else {
        const errors = await res.json();
        dispatch(receiveCommentErrors(errors));
    }
}

export const createComment = (commentData) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments`, {
        method: 'POST',
        body: commentData
    });
    if (res.ok) {
        const newComment = await res.json();
        dispatch(receiveComment(newComment));
        dispatch(clearCommentErrors());
    } else {
        const errors = await res.json();
        dispatch(receiveCommentErrors(errors));
    }
};

export const updateComment = (commentData) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments/${commentData.get('comment[id]')}`, {
        method: 'PUT',
        body: commentData
    });
    if (res.ok) {
        const updatedComment = await res.json();
        dispatch(receiveComment(updatedComment));
        dispatch(clearCommentErrors());
    } else {
        const errors = await res.json();
        dispatch(receiveCommentErrors(errors));
    }
};

export const deleteComment = (commentId) => async (dispatch) => {
    const res = await csrfFetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        dispatch(removeComment(commentId));
    } else {
        const errors = await res.json();
        dispatch(receiveCommentErrors(errors));
    }
}

// Initial State
const initialState = {};

// Reducer
const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_COMMENTS:
            return { ...state, ...action.comments };
        case RECEIVE_COMMENT:
            return { ...state, [action.comment.id]: action.comment };
        case REMOVE_COMMENT:
            const newState = { ...state };
            delete newState[action.commentId];
            return newState;
        case RECEIVE_POST:
            return { ...state, ...action.data.comments };
        default:
            return state;
    }
};

export default commentsReducer;

