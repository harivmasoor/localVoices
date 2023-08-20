import csrfFetch from "./csrf.js";

export const SET_CURRENT_USER = 'session/setCurrentUser';
export const REMOVE_CURRENT_USER = 'session/removeCurrentUser';
export const RECEIVE_SESSION_ERRORS = 'session/receiveSessionErrors';
export const CLEAR_SESSION_ERRORS = 'session/clearSessionErrors';


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
  isAuthenticated: !!JSON.parse(sessionStorage.getItem("currentUser")) // This will be true if user exists and false otherwise
};


const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...state, user: action.payload, isAuthenticated: true };
    case REMOVE_CURRENT_USER:
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

export default sessionReducer;