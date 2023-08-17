const { SET_CURRENT_USER, RECEIVE_SESSION_ERRORS, REMOVE_CURRENT_USER, CLEAR_SESSION_ERRORS, RECEIVE_UPLOAD_ERRORS } = require("./session");

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
        default:
            return state;
    }
}

export default errorsReducer;