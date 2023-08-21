import csrfFetch from "./csrf.js";
import { updateUserPhotoInPosts } from "./posts.js";

export const SET_CURRENT_USER = 'session/setCurrentUser';
export const REMOVE_CURRENT_USER = 'session/removeCurrentUser';
export const RECEIVE_SESSION_ERRORS = 'session/receiveSessionErrors';
export const CLEAR_SESSION_ERRORS = 'session/clearSessionErrors';
export const SET_USER_PROFILE_IMAGE = 'user/SET_USER_PROFILE_IMAGE';
export const DELETE_USER_PROFILE_IMAGE = 'user/DELETE_USER_PROFILE_IMAGE';
export const RECEIVE_UPLOAD_ERRORS = 'user/RECEIVE_UPLOAD_ERRORS';

export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user
});

const removeCurrentUser = () => ({
  type: REMOVE_CURRENT_USER
});

const receiveSessionErrors = (errorMessage) => ({
  type: RECEIVE_SESSION_ERRORS,
  payload: errorMessage
});
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
      dispatch(updateUserPhotoInPosts(user.id, data.user.photoUrl));
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
      dispatch(updateUserPhotoInPosts(user.id, null));
  } else {
      const data = await response.json();
      dispatch(receiveUploadErrors(data.errors));
  }
};

const storeCSRFToken = response => {
  const csrfToken = response.headers.get("X-CSRF-Token");
  if (csrfToken) sessionStorage.setItem("X-CSRF-Token", csrfToken);
}

const storeCurrentUser = user => {
  if (user) sessionStorage.setItem("currentUser", JSON.stringify(user));
  else sessionStorage.removeItem("currentUser");
}

export const login = ({ credential, password }) => async dispatch => {
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password })
  });
  if(response.ok) {
    const data = await response.json();
    storeCurrentUser(data.user);
    dispatch(setCurrentUser(data.user));
    return response;
  } else {
    const errors = await response.json();
    dispatch(receiveSessionErrors(errors))
  }
};

export const restoreSession = () => async dispatch => {
  const response = await csrfFetch("/api/session");
  storeCSRFToken(response);
  const data = await response.json();
  storeCurrentUser(data.user);
  dispatch(setCurrentUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, email, password, phone_number } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      phone_number
    })
  });

  if(response.ok) {
  const data = await response.json();
  storeCurrentUser(data.user);
  dispatch(setCurrentUser(data.user));
  return response;
  } else {
    const errors = await response.json();
    dispatch(receiveSessionErrors(errors))
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE"
  });
  storeCurrentUser(null);
  dispatch(removeCurrentUser());
  return response;
};

const initialState = { 
  user: JSON.parse(sessionStorage.getItem("currentUser")),
  isAuthenticated: !!JSON.parse(sessionStorage.getItem("currentUser")), // This will be true if user exists and false otherwise
  imageUrl: null
};


const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...state, user: action.payload, isAuthenticated: true };
    case REMOVE_CURRENT_USER:
      return { ...state, user: null, isAuthenticated: false };
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

export default sessionReducer;