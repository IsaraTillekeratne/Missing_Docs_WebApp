import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = [];

export const membersSlice = createSlice({
    name: "members",
    initialState: { value: initialStateValue },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        },
    }
})

export const { set } = membersSlice.actions;

export default membersSlice.reducer;