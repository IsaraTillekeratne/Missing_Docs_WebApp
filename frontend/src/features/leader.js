import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = "";

export const leaderSlice = createSlice({
    name: "leader",
    initialState: { value: initialStateValue },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        },
    }
})

export const { set } = leaderSlice.actions;

export default leaderSlice.reducer;