import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : null,
    token : null,
    isLoggedIn : false,
    loading : false,
    error : null,
}
 const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        loginStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess : (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
            state.email = action.payload.user.email; // Store email in state
        },
        loginFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout : (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
        },
        registerStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess : (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
        },
        registerFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
 });

 export const {loginStart, loginSuccess, loginFailure, logout, registerStart, registerSuccess, registerFailure} = authSlice.actions;
 export const authReducer = authSlice.reducer;