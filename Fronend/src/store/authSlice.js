import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    role: null,
    menu: []
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.menu = action.payload.menu;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.menu = [];
        }
    }
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
