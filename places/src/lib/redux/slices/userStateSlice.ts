import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface UserState {
    hasVisited: boolean;
}

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