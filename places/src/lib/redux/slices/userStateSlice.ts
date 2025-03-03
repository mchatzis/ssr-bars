import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { UserState } from '../types';

const initialState: UserState = {
    hasVisited: false,
};

const userStateSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setHasVisited: (state) => {
            state.hasVisited = true;
        },
    },
});

export const selectHasVisited = (state: RootState) => state.user.hasVisited;

export const { setHasVisited } = userStateSlice.actions;

export default userStateSlice;