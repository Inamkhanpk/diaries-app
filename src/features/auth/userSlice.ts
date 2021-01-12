import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces/user.interface';

const user = createSlice({
  name: 'user',
  initialState: null as User | null,
  reducers: {
    setUser(state, { payload }: PayloadAction<User>) {
      console.log(state)
      console.log(payload)
      return (state = payload);
    },
  },
});

export const { setUser } = user.actions;

export default user.reducer;