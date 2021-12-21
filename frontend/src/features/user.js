import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = "";

export const userSlice = createSlice({
    name: "user",
    initialState: { value: initialStateValue },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        },
    }
})

export const { set } = userSlice.actions;

export default userSlice.reducer;