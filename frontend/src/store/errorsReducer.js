const { SET_CURRENT_USER, RECEIVE_SESSION_ERRORS, REMOVE_CURRENT_USER, CLEAR_SESSION_ERRORS, RECEIVE_UPLOAD_ERRORS } = require("./session");
const { RECEIVE_POST_ERRORS, CLEAR_POST_ERRORS } = require("./posts");

const errorsReducer = (state = { session: []}, action) => {
    const nextState = {...state};

    switch(action.type) {
        case SET_CURRENT_USER:
            return { ...nextState, session: []}
        case REMOVE_CURRENT_USER:
            return { ...nextState, session: []}
        case RECEIVE_SESSION_ERRORS:
            return {...nextState, session: action.payload.errors};
        case CLEAR_SESSION_ERRORS:
            return { ...nextState, session: []};
        case RECEIVE_UPLOAD_ERRORS:
            return { ...nextState, session: action.payload.errors };
        case RECEIVE_POST_ERRORS:
            return { ...nextState, session: action.payload.errors };
        case CLEAR_POST_ERRORS:
            return { ...nextState, session: [] };
        default:
            return state;
    }
}

export default errorsReducer;