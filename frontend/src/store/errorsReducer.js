const { 
    SET_CURRENT_USER, 
    RECEIVE_SESSION_ERRORS, 
    REMOVE_CURRENT_USER, 
    CLEAR_SESSION_ERRORS
} = require("./session");

const { 
    RECEIVE_POST_ERRORS, 
    CLEAR_POST_ERRORS
} = require("./posts");

const { 
    RECEIVE_UPLOAD_ERRORS 
} = require("./session");

// Imported from comments
const { 
    RECEIVE_COMMENT_ERRORS, 
    CLEAR_COMMENT_ERRORS
} = require("./comments");

const errorsReducer = (state = { session: [], user: [], posts: [], comments: []}, action) => {
    const nextState = {...state};

    switch(action.type) {
        case SET_CURRENT_USER:
            return { ...nextState, session: []}
        case REMOVE_CURRENT_USER:
            return { ...nextState, session: []}
        case RECEIVE_SESSION_ERRORS:
            return {...nextState, session: action.payload?.errors || []};
        case CLEAR_SESSION_ERRORS:
            return { ...nextState, session: []};
        case RECEIVE_UPLOAD_ERRORS:
            return { ...nextState, user: action.payload?.errors || [] };
        case RECEIVE_POST_ERRORS:
            return { ...nextState, post: action.payload?.errors || [] };
        case CLEAR_POST_ERRORS:
            return { ...nextState, post: [] };
        // Added cases for comments
        case RECEIVE_COMMENT_ERRORS:
            return {...nextState, comments: action.payload?.errors || []};
        case CLEAR_COMMENT_ERRORS:
            return { ...nextState, comments: []};
        default:
            return state;
    }
}

export default errorsReducer;
