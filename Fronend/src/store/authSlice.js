import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    role: null,
    menu: [],
    token: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.menu = action.payload.menu;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.menu = [];
            state.token = null;
        }
    }
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
