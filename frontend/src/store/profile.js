import { csrfFetch } from "./csrf";

// Action Types
const SET_PROFILE = 'profile/SET_PROFILE';
const CLEAR_PROFILE = 'profile/CLEAR_PROFILE';

// Action Creators
const setProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

// Thunks
export const fetchUserProfile = (username) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/users/${username}`);
    if (response.ok) {
      const profile = await response.json();
      dispatch(setProfile(profile));
      return profile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// Initial State
const initialState = {
  user: null,
  activity: {
    posts: [],
    comments: [],
    reactions: [],
  },
};

// Reducer
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        user: action.profile.user,
        activity: action.profile.activity,
      };
    case CLEAR_PROFILE:
      return initialState;
    default:
      return state;
  }
};

export default profileReducer;

// Selectors (if needed)
export const selectUserProfile = (state) => state.profile.user;
export const selectUserActivity = (state) => state.profile.activity;
