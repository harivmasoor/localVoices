// user.js

import csrfFetch from "./csrf.js";
import { restoreSession} from "./session.js";

// Action Types
export const SET_USER_PROFILE_IMAGE = 'user/SET_USER_PROFILE_IMAGE';
export const DELETE_USER_PROFILE_IMAGE = 'user/DELETE_USER_PROFILE_IMAGE';
export const RECEIVE_UPLOAD_ERRORS = 'user/RECEIVE_UPLOAD_ERRORS';

// Action Creators
export const setUserProfileImage = (imageUrl) => ({
  type: SET_USER_PROFILE_IMAGE,
  imageUrl
});

export const receiveUploadErrors = (errors) => ({
  type: RECEIVE_UPLOAD_ERRORS,
  payload: { errors }
});

export const deleteProfileImage = () => ({ // New action for deleting the profile image
  type: DELETE_USER_PROFILE_IMAGE
});

export const uploadProfileImage = (file, user) => async (dispatch) => {
  const formData = new FormData();
  formData.append('user[photo]', file);

  const response = await csrfFetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: formData,
  });

  if (response.ok) {
      const data = await response.json();
      dispatch(setUserProfileImage(data.user.photoUrl));
      dispatch(restoreSession());
  } else {
      const data = await response.json();
      dispatch(receiveUploadErrors(data.errors));
  }
};

// New function to delete profile image
export const removeProfileImage = (user) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${user.id}/deleteImage`, { // Assuming you have an endpoint to delete the image
      method: 'DELETE',
  });

  if (response.ok) {
      dispatch(deleteProfileImage());
  } else {
      const data = await response.json();
      dispatch(receiveUploadErrors(data.errors));
  }
};

// Initial State
const initialState = { 
  user: null,
  imageUrl: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE_IMAGE:
      return {
          ...state,
          imageUrl: action.imageUrl,
      };
    case DELETE_USER_PROFILE_IMAGE:
      return {
          ...state,
          imageUrl: null,
      };
    default:
      return state;
  }
};

export default userReducer;
