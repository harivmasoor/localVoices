import csrfFetch from "./csrf";
import { RECEIVE_POST } from "./posts";

// Action Types
export const RECEIVE_REACTIONS = 'reactions/RECEIVE_REACTIONS';
export const RECEIVE_REACTION = 'reactions/RECEIVE_REACTION';
export const REMOVE_REACTION = 'reactions/REMOVE_REACTION';
export const RECEIVE_REACTION_ERRORS = 'reactions/RECEIVE_REACTION_ERRORS';
export const CLEAR_REACTION_ERRORS = 'reactions/CLEAR_REACTION_ERRORS';

// Action Creators
export const receiveReactions = (reactions) => ({
    type: RECEIVE_REACTIONS,
    reactions
});

export const receiveReaction = (reaction) => ({
    type: RECEIVE_REACTION,
    reaction
});

export const removeReaction = (reactionId) => ({
    type: REMOVE_REACTION,
    reactionId
});

export const receiveReactionErrors = (errors) => ({
    type: RECEIVE_REACTION_ERRORS,
    errors
});

export const clearReactionErrors = () => ({
    type: CLEAR_REACTION_ERRORS
});

// Thunks
export const createReaction = (reaction) => async (dispatch) => {
    const { reactableType, reactableId, userId, reactionType } = reaction;
    const res = await csrfFetch(`/api/reactions`, {
        method: 'POST',
        body: JSON.stringify({ reactableType, reactableId, userId, reactionType })
    });
    

    if (res.ok) {
        const newReaction = await res.json();
        dispatch(receiveReaction(newReaction));
        dispatch(clearReactionErrors());
    } else {
        const errors = await res.json();
        dispatch(receiveReactionErrors(errors));
    }
}

export const fetchReactionsByEntityId = (entityType, entityId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reactions?entityType=${entityType}&entityId=${entityId}`);

    if (res.ok) {
        const reactions = await res.json();
        dispatch(receiveReactions(reactions));
    } else {
        const errors = await res.json();
        dispatch(receiveReactionErrors(errors));
    }
}

export const fetchUserReactions = (userId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reactions?userId=${userId}`);

    if (res.ok) {
        const reactions = await res.json();
        dispatch(receiveReactions(reactions));
    } else {
        const errors = await res.json();
        dispatch(receiveReactionErrors(errors));
    }
}

export const updateReaction = (reaction) => async (dispatch) => {
    const { id, reactionType } = reaction;
    const res = await csrfFetch(`/api/reactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ reactionType })
    });

    if (res.ok) {
        const updatedReaction = await res.json();
        dispatch(receiveReaction(updatedReaction));
        dispatch(clearReactionErrors());
    } else {
        const errors = await res.json();
        dispatch(receiveReactionErrors(errors));
    }
}

export const deleteReaction = ( reactionId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reactions/${reactionId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeReaction(reactionId));
    } else {
        const errors = await res.json();
        dispatch(receiveReactionErrors(errors));
    }
}


// Initial State
const initialState = {};

// Reducer
const reactionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_REACTIONS:
            return { ...state, ...action.reactions };
        case RECEIVE_REACTION:
            return { ...state, [action.reaction.id]: action.reaction };
        case REMOVE_REACTION:
            const newState = { ...state };
            delete newState[action.reactionId];
            return newState;
        case RECEIVE_POST:
            return { ...state, ...action.data.reactions };
        default:
            return state;
    }
};

export default reactionsReducer;
